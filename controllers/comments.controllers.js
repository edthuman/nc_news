const { removeComment, insertComment, updateComment } = require("../models/comments.model")

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

exports.deleteComment = (request, response, next) => {
    const commentId = request.params.comment_id
    removeComment(commentId)
    .then(() => {
        response.status(204).send()
    }).catch(next)
}

exports.patchComment = (request, response, next) => {
    const commentId = request.params.comment_id
    const voteIncrement = request.body.inc_votes

    updateComment(commentId, voteIncrement)
    .then((comment) => {
        response.status(201).send({ comment })
    })
    .catch(next)
}