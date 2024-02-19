const app = require("../app");
const db = require("../db/connection");
const fs = require("fs/promises")
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data))

afterAll(() => db.end())

describe("/api", () => {
    test("GET 200, returns object describing all endpoints", () => {        
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
            return Promise.all([endpoints, fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")])
        })
        .then(([endpointsOutput, jsonExpectedEndpoints]) => {
            const expectedEndpoints = JSON.parse(jsonExpectedEndpoints) 

            expect(endpointsOutput).toEqual(expectedEndpoints);
        })
    })
})

describe("/api/topics", () => {
    test("GET 200, returns all topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
            expect(topics).toHaveLength(3)

            topics.forEach((topic) => {
                expect(topic).toMatchObject(
                    {
                        slug: expect.any(String),
                        description: expect.any(String)
                    }
                )
            })
        })
    })
})

describe("Non-existent endpoints", () => {
    test("GET 404: Responds with an error message - Not found", () => {
        return request(app)
        .get("/api/not-an-endpoint")
        .expect(404)
        .then(({ body: { msg }}) => {
            expect(msg).toBe("Not found")
        })
    })
})