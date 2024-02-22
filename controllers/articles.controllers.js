const { selectArticleById, selectAllArticles, updateArticle, insertArticle } = require("../models/articles.models")
const { selectCommentsByArticle } = require("../models/comments.model")
const { selectTopicByName } = require("../models/topics.models")

exports.getArticles = (request, response, next) => {
    const topic = request.query.topic
    const sort_by = request.query.sort_by || "created_at"
    const order = request.query.order || "DESC"
    const promises = [selectAllArticles(topic, sort_by, order)]

    if (topic) {
        promises.push(selectTopicByName(topic))
    }

    return Promise.all(promises)
    .then((returnedPromises) => {
        const articles = returnedPromises[0]

        if (articles.length === 0) {
            response.status(404).send({ articles: [] })
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
        response.status(200).send({ article })
    })
    .catch(next)
}

exports.postArticle = (request, response, next) => {
    const { author, title, body, topic } = request.body
    const articleImgUrl= request.body.article_img_url || "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
    
    insertArticle(author, title, body, topic, articleImgUrl)
    .then((articleId) => {
        return selectArticleById(articleId);
    })
    .then((article) => {
        response.status(201).send({ article })
    })
    .catch(next)
}