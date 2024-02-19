const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints } = require("./controllers/api.controllers")
const app = express()

app.use(express.json())

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.use("/*", (request, response, next) => {
    response.status(404).send({ msg: "Not found" })
})

app.use((request, response, next, error) => {
    console.log(error)
    response.status(500).send({ error: { msg: "Internal server error"}})
})

module.exports = app