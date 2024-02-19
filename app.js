const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")
const app = express()

app.get("/api/topics", getTopics)

app.use("/*", (request, response, next) => {
    response.status(404).send({ msg: "Not found" })
})

app.use((request, response, next, error) => {
    console.log(error)
    response.status(500).send({ error: { msg: "Internal server error"}})
})

module.exports = app