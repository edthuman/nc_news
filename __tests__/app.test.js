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
                    expect(msg).toBe("Bad request")
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
                        expect(msg).toBe("Bad request")
                    });
            });
        })

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
                            created_at: "2020-10-16T05:03:00.000Z",
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

            test("PATCH 201: responds with the updated article object for a positive integer", () => {
                const votePatch = { inc_votes: 1 };

                return request(app)
                    .patch("/api/articles/1")
                    .send(votePatch)
                    .expect(201)
                    .then(({ body: { article } }) => {
                        expect(article.votes).toBe(101);
                    });
            });

            test("PATCH 201: responds with the updated article object for a negative integer", () => {
                const votePatch = { inc_votes: -50 };

                return request(app)
                    .patch("/api/articles/1")
                    .send(votePatch)
                    .expect(201)
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
            });
        });
    });

    describe("/comments/:comment_id", () => {
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
