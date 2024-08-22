const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("/api", () => {
    test("GET 200: returns object describing all endpoints", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: { endpoints } }) => {
                const expectedEndpoints = require("../endpoints.json");
                expect(endpoints).toEqual(expectedEndpoints);
            });
    });

    describe("/topics", () => {
        test("GET 200: returns all topics", () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body: { topics } }) => {
                    expect(topics).toHaveLength(3);

                    topics.forEach((topic) => {
                        expect(topic).toMatchObject({
                            slug: expect.any(String),
                            description: expect.any(String),
                        });
                    });
                });
        });

        test("POST 201: returns the newly added topic object", () => {
            const newTopic = { slug: "topic name", description: "what new topic is" }
            
            return request(app)
                .post("/api/topics")
                .send(newTopic)
                .expect(201)
                .then(({ body: { topic } }) => {
                    expect(topic).toMatchObject({ slug: "topic name", description: "what new topic is" });
                });
        });

        test("POST 400: returns an error when no body is sent - Bad request", () => {
            return request(app)
                .post("/api/topics")
                .send()
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });

        test("POST 400: returns an error when the given object has a key missing - Bad request", () => {
            const newTopic = {
                slug: "An indescribable topic"
            };
            //description key not present

            return request(app)
                .post("/api/topics")
                .send(newTopic)
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });
    });

    describe("/articles", () => {
        test("GET 200: returns an array of articles", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles).toHaveLength(13);
                    expect(articles).toBeSortedBy("created_at", {
                        descending: true,
                    });

                    articles.forEach((article) => {
                        expect(article).not.toHaveProperty("body");

                        expect(article).toMatchObject({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_img_url: expect.any(String),
                            comment_count: expect.any(Number),
                        });
                    });
                });
        });

        test("POST 201: returns the new article object", () => {
            const newArticle = {
                author: "lurker",
                title: "Here's an article about cats",
                body: "I like cats.",
                topic: "cats",
                article_img_url:
                    "https://images.pexels.com/photos/15862.jpeg?w=700&h=700",
            };

            return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(201)
                .then(({ body: { article } }) => {
                    expect(article).toMatchObject({
                        author: "lurker",
                        title: "Here's an article about cats",
                        body: "I like cats.",
                        article_id: 14,
                        topic: "cats",
                        created_at: expect.any(String),
                        votes: 0,
                        article_img_url:
                            "https://images.pexels.com/photos/15862.jpeg?w=700&h=700",
                        comment_count: 0,
                    });
                });
        });

        test("POST 201: posts an article with a default article_img_url when one is not given", () => {
            const newArticle = {
                author: "lurker",
                title: "Here's an article about cats",
                body: "I like cats.",
                topic: "cats",
            };

            return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(201)
                .then(({ body: { article } }) => {
                    expect(article.article_img_url).toBe(
                        "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
                    );
                });
        });

        test("POST 400: returns an error when no body is sent - Bad request", () => {
            return request(app)
                .post("/api/articles")
                .send()
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });

        test("POST 400: returns an error when the given object has a key missing - Bad request", () => {
            const newArticle = {
                title: "Here's an article about cats",
                body: "I like cats.",
                topic: "cats",
            };
            //author key not present

            return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });

        test("POST 404: returns an error when the given object gives a non-existent author - Not found", () => {
            const newArticle = {
                author: "jessica",
                title: "Here's an article about cats",
                body: "I like cats.",
                topic: "cats",
                article_img_url:
                    "https://images.pexels.com/photos/15862.jpeg?w=700&h=700",
            };

            return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Not found");
                });
        });

        test("POST 404: returns an error when the given object gives a non-existent topic - Not found", () => {
            const newArticle = {
                author: "lurker",
                title: "Here's an article about cats",
                body: "I like cats.",
                topic: "not-a-topic",
                article_img_url:
                    "https://images.pexels.com/photos/15862.jpeg?w=700&h=700",
            };

            return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Not found");
                });
        });

        describe("?limit", () => {
            test("GET 200: returns an array of 10 articles by default", () => {
                return request(app)
                    .get("/api/articles?limit")
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.articles).toHaveLength(10);
                        expect(body.total_count).toBe(13);
                    });
            });

            test("GET 200: returns the given number of articles when queried", () => {
                return request(app)
                    .get("/api/articles?limit=2")
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.articles).toHaveLength(2);
                        expect(body.total_count).toBe(13);
                    });
            });

            test("GET 200: returns the given number of articles when queried with limit and another query", () => {
                return request(app)
                    .get("/api/articles?limit=4&sort_by=author")
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.articles).toHaveLength(4);
                        expect(body.total_count).toBe(13);
                        expect(body.articles).toBeSortedBy("author", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns the correct total_count when another query reduces number of results", () => {
                return request(app)
                    .get("/api/articles?limit=4&topic=mitch")
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.articles).toHaveLength(4);
                        expect(body.total_count).toBe(12);
                        expect(body.articles).toBeSortedBy("author", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns one page of articles when limit given is greater than the number of search results", () => {
                return request(app)
                    .get("/api/articles?limit=20")
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.articles).toHaveLength(13);
                        expect(body.total_count).toBe(13);
                    });
            });

            test("GET 400: responds with an error message when queried with limit 0", () => {
                return request(app)
                    .get("/api/articles?limit=0")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });

            test("GET 400: responds with an error message when queried with a limit below 0", () => {
                return request(app)
                    .get("/api/articles?limit=-2")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });

            test("GET 400: responds with an error message when queried with an invalid limit", () => {
                return request(app)
                    .get("/api/articles?limit=not-a-number")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });
        });

        describe("?p", () => {
            test("GET 200, returns the first page when queried with 1", () => {
                return request(app)
                    .get("/api/articles?sort_by=article_id&order=ASC&p=1")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles.length).toBe(10);

                        articles.forEach((article) => {
                            expect(article.article_id).toBeGreaterThanOrEqual(
                                1
                            );
                            expect(article.article_id).toBeLessThanOrEqual(10);
                        });
                    });
            });

            test("GET 200, returns the first page when given an empty query", () => {
                return request(app)
                    .get("/api/articles?sort_by=article_id&order=ASC&p=")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles.length).toBe(10);

                        articles.forEach((article) => {
                            expect(article.article_id).toBeGreaterThanOrEqual(
                                1
                            );
                            expect(article.article_id).toBeLessThanOrEqual(10);
                        });
                    });
            });

            test("GET 200, returns any given page number", () => {
                return request(app)
                    .get(
                        "/api/articles?sort_by=article_id&order=ASC&limit=2&p=4"
                    )
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles.length).toBe(2);

                        articles.forEach((article) => {
                            expect(article.article_id).toBeGreaterThanOrEqual(
                                7
                            );
                            expect(article.article_id).toBeLessThanOrEqual(8);
                        });
                    });
            });

            test("GET 400, responds with an error message when given query of 0", () => {
                return request(app)
                    .get("/api/articles?p=0")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });

            test("GET 400, responds with an error message when given query of a negative number", () => {
                return request(app)
                    .get("/api/articles?p=-10")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });

            test("GET 400, responds with an error message when given an invalid page number", () => {
                return request(app)
                    .get("/api/articles?p=not-a-number")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });

            test("GET 404, responds with an empty array when given a page that features no results", () => {
                return request(app)
                    .get("/api/articles?p=100")
                    .expect(404)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(0);
                    });
            });
        });

        describe("?topic", () => {
            test("GET 200: returns only the articles of a given topic", () => {
                return request(app)
                    .get("/api/articles?topic=mitch")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(12);

                        articles.forEach((article) => {
                            expect(article.topic).toBe("mitch");
                        });
                    });
            });

            test("GET 404: responds with an error message when given non-existent topic - Not found", () => {
                return request(app)
                    .get("/api/articles?topic=not-a-topic")
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Not found");
                    });
            });

            test("GET 404: responds with an empty array when a topic that exists has no related articles", () => {
                return request(app)
                    .get("/api/articles?topic=paper")
                    .expect(404)
                    .then(({ body: { articles } }) => {
                        expect(articles).toEqual([]);
                    });
            });
        });

        describe("?sort_by", () => {
            test("GET 200: returns articles sorted by created_at by default", () => {
                return request(app)
                    .get("/api/articles?sort_by")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("created_at", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns articles sorted by created_at when queried", () => {
                return request(app)
                    .get("/api/articles?sort_by=created_at")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("created_at", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns articles sorted by author when queried", () => {
                return request(app)
                    .get("/api/articles?sort_by=author")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("author", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns articles sorted by title when queried", () => {
                return request(app)
                    .get("/api/articles?sort_by=title")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("title", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns articles sorted by article_id when queried", () => {
                return request(app)
                    .get("/api/articles?sort_by=article_id")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("article_id", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns articles sorted by topic when queried", () => {
                return request(app)
                    .get("/api/articles?sort_by=topic")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("topic", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns articles sorted by votes when queried", () => {
                return request(app)
                    .get("/api/articles?sort_by=votes")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("votes", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns articles sorted by article_img_url when queried", () => {
                return request(app)
                    .get("/api/articles?sort_by=article_img_url")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("article_img_url", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns articles sorted by comment_count when queried", () => {
                return request(app)
                    .get("/api/articles?sort_by=comment_count")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("comment_count", {
                            descending: true,
                        });
                    });
            });

            test("GET 400: responds with an error when sort_by query is invalid - Bad request", () => {
                return request(app)
                    .get("/api/articles?sort_by=not-a-category")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });
        });

        describe("order", () => {
            test("GET 200: returns articles sorted descending by default", () => {
                return request(app)
                    .get("/api/articles?order")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("created_at", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns articles sorted descending when queried", () => {
                return request(app)
                    .get("/api/articles?order=DESC")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("created_at", {
                            descending: true,
                        });
                    });
            });

            test("GET 200: returns articles sorted ascending when queried", () => {
                return request(app)
                    .get("/api/articles?order=ASC")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("created_at", {
                            descending: false,
                        });
                    });
            });

            test("GET 400: responds with an error message when query is invalid - Bad request", () => {
                return request(app)
                    .get("/api/articles?order=random")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });
        });

        describe("/:article_id", () => {
            test("GET 200: returns correct article object", () => {
                return request(app)
                    .get("/api/articles/2")
                    .expect(200)
                    .then(({ body: { article } }) => {
                        expect(article).toMatchObject({
                            article_id: 2,
                            author: "icellusedkars",
                            title: "Sony Vaio; or, The Laptop",
                            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                            topic: "mitch",
                            created_at: expect.any(String),
                            votes: 0,
                            article_img_url:
                                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                        });
                    });
            });

            test("GET 200: returns all articles when no id is given", () => {
                return request(app)
                    .get("/api/articles/")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(13);
                        expect(articles).toBeSortedBy("created_at", {
                            descending: true,
                        });

                        articles.forEach((article) => {
                            expect(article).not.toHaveProperty("body");

                            expect(article).toMatchObject({
                                author: expect.any(String),
                                title: expect.any(String),
                                article_id: expect.any(Number),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                article_img_url: expect.any(String),
                                comment_count: expect.any(Number),
                            });
                        });
                    });
            });

            test("GET 200: returned object gives the correct comment count for article", () => {
                return request(app)
                    .get("/api/articles/1")
                    .expect(200)
                    .then(({ body: { article } }) => {
                        expect(article.comment_count).toBe(11);
                    });
            });

            test("GET 400: responds with an error message when given invalid id - Bad request", () => {
                return request(app)
                    .get("/api/articles/not-a-number")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });

            test("GET 404: responds with an error message when given non-existent id - Not found", () => {
                return request(app)
                    .get("/api/articles/400")
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Not found");
                    });
            });

            test("PATCH 200: responds with the updated article object for a positive integer", () => {
                const votePatch = { inc_votes: 1 };

                return request(app)
                    .patch("/api/articles/1")
                    .send(votePatch)
                    .expect(200)
                    .then(({ body: { article } }) => {
                        expect(article.votes).toBe(101);
                    });
            });

            test("PATCH 200: responds with the updated article object for a negative integer", () => {
                const votePatch = { inc_votes: -50 };

                return request(app)
                    .patch("/api/articles/1")
                    .send(votePatch)
                    .expect(200)
                    .then(({ body: { article } }) => {
                        expect(article.votes).toBe(50);
                    });
            });

            test("PATCH 400: responds with an error message when no object is given - Bad request", () => {
                return request(app)
                    .patch("/api/articles/1")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });

            test("PATCH 400: responds with an error message when object has no inc_votes key - Bad request", () => {
                const noVotes = { key: "value" };

                return request(app)
                    .patch("/api/articles/1")
                    .send(noVotes)
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });

            test("PATCH 400: responds with an error message when inc_votes is invalid - Bad request", () => {
                const votePatch = { inc_value: "string" };

                return request(app)
                    .patch("/api/articles/1")
                    .send(votePatch)
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });

            test("PATCH 400: responds with an error message when given an invalid article_id - Bad request", () => {
                const votePatch = { inc_votes: 10 };

                return request(app)
                    .patch("/api/articles/not-a-number")
                    .send(votePatch)
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });

            test("PATCH 404: responds with an error message when given a non-existent article_id - Not found", () => {
                const votePatch = { inc_votes: 10 };

                return request(app)
                    .patch("/api/articles/321")
                    .send(votePatch)
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Not found");
                    });
            });

            test("PATCH 404: responds with an error message when given no article_id - Not found", () => {
                const votePatch = { inc_votes: 10 };

                return request(app)
                    .patch("/api/articles/")
                    .send(votePatch)
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Not found");
                    });
            });

            test("DELETE 204: responds with no content and deletes the article with given article_id" , () => {
                return request(app)
                .delete("/api/articles/2")
                .expect(204)
                .then(() => {
                    return request(app).get("/api/articles")
                })
                .then(({ body: { articles }}) => {
                    expect(articles).toHaveLength(12);

                    articles.forEach((article) => {
                        expect(article.article_id).not.toBe(2)
                    })
                });
            })

            test("DELETE 404: responds with an error message when given a non-existent - Not found" , () => {
                return request(app)
                .delete("/api/articles/200")
                .expect(404)
                .then(({ body: { msg }}) => {
                    expect(msg).toBe("Not found")
                })
            })

            test("DELETE 400: responds with an error message when given an invalid article_id - Bad request" , () => {
                return request(app)
                .delete("/api/articles/not-a-number")
                .expect(400)
                .then(({ body: { msg }}) => {
                    expect(msg).toBe("Bad request")
                })
            })

            describe("/comments", () => {
                test("GET 200: responds with an array of comments for given article, sorted most recent first", () => {
                    return request(app)
                        .get("/api/articles/3/comments")
                        .expect(200)
                        .then(({ body: { comments } }) => {
                            expect(comments).toHaveLength(2);

                            comments.forEach((comment) => {
                                expect(comment).toMatchObject({
                                    comment_id: expect.any(Number),
                                    votes: expect.any(Number),
                                    created_at: expect.any(String),
                                    author: expect.any(String),
                                    body: expect.any(String),
                                    article_id: 3,
                                });
                            });

                            expect(comments).toBeSortedBy("created_at", {
                                descending: true,
                            });
                        });
                });

                test("GET 404: responds with an empty array when an article exists, but has no comments - Not found", () => {
                    return request(app)
                        .get("/api/articles/2/comments")
                        .expect(404)
                        .then(({ body: { comments } }) => {
                            expect(comments).toEqual([]);
                        });
                });

                test("GET 404: responds with an error message when given non-existent id - Not found", () => {
                    return request(app)
                        .get("/api/articles/321/comments")
                        .expect(404)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("Not found");
                        });
                });

                test("POST 201: responds with the new comment object", () => {
                    const comment = {
                        username: "lurker",
                        body: "I love this article so much",
                    };

                    return request(app)
                        .post("/api/articles/2/comments")
                        .send(comment)
                        .expect(201)
                        .then(({ body: { comment } }) => {
                            expect(comment).toMatchObject({
                                comment_id: expect.any(Number),
                                votes: 0,
                                created_at: expect.any(String),
                                author: "lurker",
                                body: "I love this article so much",
                                article_id: 2,
                            });
                        });
                });

                test("POST 400: responds with an error message when no object given - Bad request", () => {
                    return request(app)
                        .post("/api/articles/2/comments")
                        .send()
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("Bad request");
                        });
                });

                test("POST 400: responds with an error message when object given is missing a key - Bad request", () => {
                    const comment = { body: "I love this article so much" };

                    return request(app)
                        .post("/api/articles/2/comments")
                        .send(comment)
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("Bad request");
                        });
                });

                test("POST 400: responds with an error message when given an invalid article_id - Bad request", () => {
                    const comment = {
                        username: "lurker",
                        body: "I love this article so much",
                    };
                    return request(app)
                        .post("/api/articles/not-a-number/comments")
                        .send(comment)
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("Bad request");
                        });
                });

                test("POST 404: responds with an error message when given non-existent article_id - Not found", () => {
                    const comment = {
                        username: "lurker",
                        body: "I love this article so much",
                    };

                    return request(app)
                        .post("/api/articles/100/comments")
                        .send(comment)
                        .expect(404)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("Not found");
                        });
                });

                test("POST 404: responds with an error message when given no article_id", () => {
                    const comment = {
                        username: "lurker",
                        body: "I love this article so much",
                    };
                    return request(app)
                        .post("/api/articles//comments")
                        .send(comment)
                        .expect(404)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("Not found");
                        });
                });

                test("POST 404: responds with an error message when username does not relate to an existing user - Not found", () => {
                    const comment = {
                        username: "Jonathan",
                        body: "I love this article so much",
                    };

                    return request(app)
                        .post("/api/articles/2/comments")
                        .send(comment)
                        .expect(404)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("Not found");
                        });
                });

                describe("?limit", () => {
                    test("GET 200: returns an array of 10 comments by default", () => {
                        return request(app)
                            .get("/api/articles/1/comments?limit")
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments).toHaveLength(10);
                            });
                    });

                    test("GET 200: returns the given number of comments when queried", () => {
                        return request(app)
                            .get("/api/articles/1/comments?limit=5")
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments).toHaveLength(5);
                            });
                    });

                    test("GET 200: returns one page of comments when limit given is greater than the number of search results", () => {
                        return request(app)
                            .get("/api/articles/1/comments?limit=20")
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments).toHaveLength(11);
                            });
                    });

                    test("GET 400: responds with an error message when queried with limit 0", () => {
                        return request(app)
                            .get("/api/articles/2/comments?limit=0")
                            .expect(400)
                            .then(({ body: { msg } }) => {
                                expect(msg).toBe("Bad request");
                            });
                    });

                    test("GET 400: responds with an error message when queried with a limit below 0", () => {
                        return request(app)
                            .get("/api/articles/2/comments?limit=-2")
                            .expect(400)
                            .then(({ body: { msg } }) => {
                                expect(msg).toBe("Bad request");
                            });
                    });

                    test("GET 400: responds with an error message when queried with an invalid limit", () => {
                        return request(app)
                            .get("/api/articles/2/comments?limit=not-a-number")
                            .expect(400)
                            .then(({ body: { msg } }) => {
                                expect(msg).toBe("Bad request");
                            });
                    });
                });

                describe("?p" , () => {
                    test("GET 200, returns the first page when queried with 1", () => {
                        return request(app)
                        .get("/api/articles?sort_by=article_id&order=ASC&p=1")
                        .expect(200)
                        .then(({ body: { articles }}) => {
                            expect(articles.length).toBe(10)

                            articles.forEach((article) => {
                                expect(article.article_id).toBeGreaterThanOrEqual(1)
                                expect(article.article_id).toBeLessThanOrEqual(10)
                            })
                        })
                    })

                    test("GET 200, returns the first page when given an empty query", () => {
                        return request(app)
                        .get("/api/articles?sort_by=article_id&order=ASC&p=")
                        .expect(200)
                        .then(({ body: { articles }}) => {
                            expect(articles.length).toBe(10)

                            articles.forEach((article) => {
                                expect(article.article_id).toBeGreaterThanOrEqual(1)
                                expect(article.article_id).toBeLessThanOrEqual(10)
                            })
                        })
                    })

                    test("GET 200, returns any given page number", () => {
                        return request(app)
                        .get("/api/articles?sort_by=article_id&order=ASC&limit=2&p=4")
                        .expect(200)
                        .then(({ body: { articles }}) => {
                            expect(articles.length).toBe(2)

                            articles.forEach((article) => {
                                expect(article.article_id).toBeGreaterThanOrEqual(7)
                                expect(article.article_id).toBeLessThanOrEqual(8)
                            })
                        })
                    })

                    test("GET 400, responds with an error message when given query of 0", () => {
                        return request(app)
                        .get("/api/articles?p=0")
                        .expect(400)
                        .then(({ body: { msg }}) => {
                            expect(msg).toBe("Bad request")
                        })
                    })

                    test("GET 400, responds with an error message when given query of a negative number", () => {
                        return request(app)
                        .get("/api/articles?p=-10")
                        .expect(400)
                        .then(({ body: { msg }}) => {
                            expect(msg).toBe("Bad request")
                        })
                    })

                    test("GET 400, responds with an error message when given an invalid page number", () => {
                        return request(app)
                        .get("/api/articles?p=not-a-number")
                        .expect(400)
                        .then(({ body: { msg }}) => {
                            expect(msg).toBe("Bad request")
                        })
                    })

                    test("GET 404, responds with an empty array when given a page that features no results", () => {
                        return request(app)
                        .get("/api/articles?p=100")
                        .expect(404)
                        .then(({ body: { articles }}) => {
                            expect(articles).toHaveLength(0)
                        })
                    })
                })
            });
        });
    });

    describe("/comments/:comment_id", () => {
        test("PATCH 200, increases the vote count of a given comment by a positive integer", () => {
            const commentPatch = { inc_votes: 1 };

            return request(app)
                .patch("/api/comments/1")
                .send(commentPatch)
                .expect(200)
                .then(({ body: { comment } }) => {
                    expect(comment).toMatchObject({
                        comment_id: 1,
                        votes: 17,
                        created_at: expect.any(String),
                        author: "butter_bridge",
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                        article_id: 9,
                    });
                });
        });

        test("PATCH 200, increases the vote count of a given comment by a positive integer", () => {
            const commentPatch = { inc_votes: -5 };

            return request(app)
                .patch("/api/comments/1")
                .send(commentPatch)
                .expect(200)
                .then(({ body: { comment } }) => {
                    expect(comment).toMatchObject({
                        comment_id: 1,
                        votes: 11,
                        created_at: expect.any(String),
                        author: "butter_bridge",
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                        article_id: 9,
                    });
                });
        });

        test("PATCH 400, returns an error message when no object is sent - Bad request", () => {
            return request(app)
                .patch("/api/comments/1")
                .send()
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });

        test("PATCH 400, returns an error message when given object has no inc_votes key - Bad request", () => {
            const commentPatch = { key: "Not inc_votes" };

            return request(app)
                .patch("/api/comments/1")
                .send(commentPatch)
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });

        test("PATCH 400, returns an error message when given object has invalid inc_votes value - Bad request", () => {
            const commentPatch = { inc_votes: "a string" };

            return request(app)
                .patch("/api/comments/1")
                .send(commentPatch)
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });

        test("PATCH 400, returns an error message when invalid comment_id is given - Bad request", () => {
            const commentPatch = { inc_votes: "a string" };

            return request(app)
                .patch("/api/comments/not-a-number")
                .send(commentPatch)
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });

        test("PATCH 404, returns an error message when a non-existent comment_id is given - Not found", () => {
            const commentPatch = { inc_votes: "10" };

            return request(app)
                .patch("/api/comments/321")
                .send(commentPatch)
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Not found");
                });
        });

        test("PATCH 404, returns an error message when no comment_id is given - Not found", () => {
            const commentPatch = { inc_votes: "10" };

            return request(app)
                .patch("/api/comments/")
                .send(commentPatch)
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Not found");
                });
        });

        test("DELETE 204: deletes a comment of given id with no return value", () => {
            return request(app)
                .delete("/api/comments/2")
                .expect(204)
                .then(() => {
                    return request(app).get("/api/articles/1/comments");
                })
                .then(({ body: { comments } }) => {
                    expect(comments).toHaveLength(10);
                });
        });

        test("DELETE 400: returns an error message when given invalid comment_id", () => {
            return request(app)
                .delete("/api/comments/not-a-number")
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });

        test("DELETE 404: returns an error message when given non-existent comment_id", () => {
            return request(app)
                .delete("/api/comments/321")
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Not found");
                });
        });

        test("DELETE 404: returns an error message when not given a comment_id", () => {
            return request(app)
                .delete("/api/comments/")
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Not found");
                });
        });
    });

    describe("/users", () => {
        test("GET 200: returns an array of users", () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body: { users } }) => {
                    expect(users).toHaveLength(4);

                    users.forEach((user) => {
                        expect(user).toMatchObject({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String),
                        });
                    });
                });
        });

        describe("/:username", () => {
            test("GET 200: returns the correct user when given a username", () => {
                return request(app)
                    .get("/api/users/rogersop")
                    .expect(200)
                    .then(({ body: { user } }) => {
                        expect(user).toMatchObject({
                            username: "rogersop",
                            name: "paul",
                            avatar_url:
                                "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
                        });
                    });
            });

            test("GET 200: returns an array of all users when given no input", () => {
                return request(app)
                    .get("/api/users/")
                    .expect(200)
                    .then(({ body: { users } }) => {
                        expect(users).toHaveLength(4);

                        users.forEach((user) => {
                            expect(user).toMatchObject({
                                username: expect.any(String),
                                name: expect.any(String),
                                avatar_url: expect.any(String),
                            });
                        });
                    });
            });

            test("GET 404: responds with an error message when given a non-existent username", () => {
                return request(app)
                    .get("/api/users/fake-name")
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Not found");
                    });
            });
            //no input - returns all users
        });
    });
});

describe("Non-existent endpoints", () => {
    test("GET 404: responds with an error message for non-existent endpoints - Not found", () => {
        return request(app)
            .get("/api/not-an-endpoint")
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Not found");
            });
    });
});
