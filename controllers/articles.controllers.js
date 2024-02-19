const { selectArticleById, selectAllArticles } = require("../models/articles.models")

exports.getArticles = (request, response, next) => {
    selectAllArticles()
    .then((articles) => {
        response.status(200).send({ articles })
    })
}

exports.getArticleById = (request, response, next) => {
    const articleId = request.params.article_id
    selectArticleById(articleId)
    .then((article) => {
        response.status(200).send({ article })
    })
    .catch((error) => {
        next(error)
    })
}