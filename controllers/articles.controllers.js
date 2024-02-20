const { selectArticleById, selectAllArticles, selectCommentsByArticle } = require("../models/articles.models")

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

exports.getCommentsByArticle = (request, response, next) => {
    const articleId = request.params.article_id

    const promises = [selectCommentsByArticle(articleId), selectArticleById(articleId)]

    return Promise.all(promises)
    .then((result) => {
        const comments = result[0]

        if (comments.length === 0) {
            response.status(204).send()
        }
        
        response.status(200).send({ comments })
    })
    .catch(next)
}