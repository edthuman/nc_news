const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const { getEndpoints } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

apiRouter.get("/topics", getTopics);

apiRouter.use("/articles", articlesRouter)

apiRouter.use("/comments", commentsRouter);

apiRouter.get("/users", getUsers);

module.exports = apiRouter;
