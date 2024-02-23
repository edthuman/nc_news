const { selectArticleById, selectAllArticles, updateArticle, insertArticle, removeArticle } = require("../models/articles.models")
const { selectCommentsByArticle } = require("../models/comments.model")
const { selectTopicByName } = require("../models/topics.models")

exports.getArticles = (request, response, next) => {
    const topic = request.query.topic
    const sort_by = request.query.sort_by || "created_at"
    const order = request.query.order || "DESC"
    let limit = "" 
    let pageNumber = ""

    if (Object.hasOwn(request.query, "limit") || Object.hasOwn(request.query, "p")) {
        limit = request.query.limit || "10"
        pageNumber = request.query.p || "1"
    }

    const promises = [selectAllArticles(topic, sort_by, order, limit, pageNumber)]
    

    if (topic) {
        promises.push(selectTopicByName(topic))
    }

    return Promise.all(promises)
    .then((returnedPromises) => {
        const articles = returnedPromises[0][0]
        const total_count = returnedPromises[0][1]

        if (articles.length === 0) {
            response.status(404).send({ 
                articles: [], 
                total_count: 0 
            })
        } else {
            response.status(200).send({ 
                articles, 
                total_count 
            })
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
    const limit = request.query.limit || "10"
    const pageNumber = request.query.p || "1"

    const promises = [selectCommentsByArticle(articleId, limit, pageNumber), selectArticleById(articleId)]

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

exports.deleteArticle = (request, response, next) => {
    const id = request.params.article_id

    removeArticle(id)
    .then(() => {
        response.status(204).send()
    })
    .catch(next)
}