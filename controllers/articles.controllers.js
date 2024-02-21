const { selectArticleById, selectAllArticles, updateArticle } = require("../models/articles.models")
const { selectCommentsByArticle } = require("../models/comments.model")

exports.getArticles = (request, response, next) => {
    const topic = request.query.topic

    selectAllArticles(topic)
    .then((articles) => {
        if (articles.length === 0) {
            response.status(404).send({ articles: []})
        } else {
            response.status(200).send({ articles })
        }
    })
    .catch(next)
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
            response.status(404).send({ comments })
        } else {
            response.status(200).send({ comments })
        }
    })
    .catch(next)
}

exports.patchArticle = (request, response, next) => {
    const articleId = request.params.article_id
    const votesIncrement = request.body.inc_votes

    return selectArticleById(articleId)
    .then(() => {
        return updateArticle(articleId, votesIncrement)
    })
    .then((article) => {
        response.status(201).send({ article })
    })
    .catch(next)
}