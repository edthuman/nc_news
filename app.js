const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints } = require("./controllers/api.controllers")
const { getArticleById, getArticles, getCommentsByArticle, patchArticle } = require("./controllers/articles.controllers")
const { deleteComment, postComment } = require("./controllers/comments.controllers")
const { getUsers } = require("./controllers/users.controllers")
const app = express()

app.use(express.json())

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.patch("/api/articles/:article_id", patchArticle)

app.get("/api/articles/:article_id/comments", getCommentsByArticle)

app.post("/api/articles/:article_id/comments", postComment)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)

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
    if (error.code === "22P02" || error.code === "23502") {
        response.status(400).send({ msg: "Bad request" })
    } else  if (error.code === "23503") {
        response.status(404).send({ msg: "Not found" })
    } else {
        next(error)
    }
})

app.use((error, request, response, next) => {
    console.log(error)
    response.status(500).send({ msg: "Internal server error"})
})

module.exports = app