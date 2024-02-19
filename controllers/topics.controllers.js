const { selectAllTopics } = require("../models/topics.models")

exports.getTopics = (request, response, next) => {
    return selectAllTopics()
    .then((topics) => {
        response.status(200).send({ topics })
    })
    .catch(next)
}