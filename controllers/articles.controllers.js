const { selectArticleById } = require("../models/articles.models")

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