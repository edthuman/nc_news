const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const { getEndpoints } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");
const usersRouter = require("./users-router");

const apiRouter = require("express").Router();


apiRouter.get("/", getEndpoints);

apiRouter.get("/topics", getTopics);

apiRouter.use("/articles", articlesRouter)

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);


module.exports = apiRouter;
