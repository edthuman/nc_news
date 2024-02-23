const { selectAllTopics, insertTopic } = require("../models/topics.models")

exports.getTopics = (request, response, next) => {
    return selectAllTopics()
    .then((topics) => {
        response.status(200).send({ topics })
    })
    .catch(next)
}

exports.postTopic = (request, response, next) => {
    const { slug, description } = request.body
    
    return insertTopic(slug, description)
    .then((topic) => {
        response.status(201).send({ topic })
    })
    .catch(next)
}