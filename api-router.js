const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const { getEndpoints } = require("./controllers/api.controllers");
const usersRouter = require("./users-router");
const topicsRouter = require("./topics-router")
const apiRouter = require("express").Router();


apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter)

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);


module.exports = apiRouter;
