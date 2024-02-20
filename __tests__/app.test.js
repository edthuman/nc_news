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
});

describe("/api/topics", () => {
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

describe("/api/articles", () => {
    test("GET 200: returns an array of articles", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(13);
                expect(articles).toBeSortedBy("created_at", { descending: true })

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
                    expect(articles).toBeSortedBy("created_at", { descending: true })

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

        describe("/comments", () => {
            test("GET 200: responds with an array of comments for given article, sorted most recent first", () => {
                return request(app)
                .get("/api/articles/3/comments")
                .expect(200)
                .then(({body: {comments}}) => {
                    expect(comments).toHaveLength(2)
                    
                    comments.forEach((comment) => {
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            article_id: 3
                        })
                    })

                    expect(comments).toBeSortedBy("created_at", { descending: true })
                })
            })

            test("GET 204: responds with no content status when an article exists, but has no comments", () => {
                return request(app)
                .get("/api/articles/2/comments")
                .expect(204)
            })

            test("GET 400: responds with an error message when given invalid id - Bad request", () => {
                return request(app)
                .get("/api/articles/not-a-number/comments")
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
            })

            test("GET 404: responds with an error message when given non-existent id - Not found", () => {
                return request(app)
                .get("/api/articles/321/comments")
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Not found");
                });
            })
        })
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
