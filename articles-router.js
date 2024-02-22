const { getArticles, getArticleById, patchArticle, getCommentsByArticle, postArticle } = require("./controllers/articles.controllers");
const { postComment } = require("./controllers/comments.controllers");

const articlesRouter = require("express").Router()

articlesRouter
    .route("/")
    .get(getArticles)
    .post(postArticle)

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticle)

    articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticle)
    .post(postComment)

module.exports = articlesRouter