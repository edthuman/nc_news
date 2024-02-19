const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints } = require("./controllers/api.controllers")
const { getArticleById } = require("./controllers/articles.controllers")
const app = express()

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.use("/*", (request, response, next) => {
    response.status(404).send({ msg: "Not found" })
})

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg})
    } else {
        next(error)
    }
})

app.use((error, request, response, next) => {
    if (error.code === "22P02") {
        response.status(400).send({ msg: "Bad request"})
    } else {
        next(error)
    }
})

app.use((error, request, response, next) => {
    console.log(error)
    response.status(500).send({ msg: "Internal server error"})
})

module.exports = app