const { selectArticleById, selectAllArticles } = require("../models/articles.models")
const { insertComment, selectCommentsByArticle } = require("../models/comments.model")

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
            response.status(404).send({ comments })
        } else {
            response.status(200).send({ comments })
        }
    })
    .catch(next)
}

exports.postComment = (request, response, next) => {
    const articleId = request.params.article_id
    const username = request.body.username
    const commentText = request.body.body

    return insertComment(articleId, username, commentText)
    .then((comment) => {
        response.status(201).send({ comment })
    })
    .catch(next)
}