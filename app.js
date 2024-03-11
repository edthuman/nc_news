const express = require("express");
const apiRouter = require("./api-router");
const cors = require('cors');

const app = express();
app.use(cors())

app.use(express.json());

app.use("/api", apiRouter)

app.use("/*", (request, response, next) => {
    response.status(404).send({ msg: "Not found" });
});

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
    } else {
        next(error);
    }
});

app.use((error, request, response, next) => {
    if (error.code === "22P02" || error.code === "23502" || error.code === '2201X' || error.code === '42703') {
        response.status(400).send({ msg: "Bad request" });
    } else if (error.code === "23503") {
        response.status(404).send({ msg: "Not found" });
    } else {
        next(error);
    }
});

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
