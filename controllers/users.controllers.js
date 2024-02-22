const { selectAllUsers, selectUserByUsername } = require("../models/users.models")

exports.getUsers = (request, response, next) => {
    selectAllUsers()
    .then((users) => {
        response.status(200).send({ users })
    })
    .catch(next)
}

exports.getUserByUsername = (request, response, next) => {
    const username = request.params.username

    selectUserByUsername(username)
    .then((user) => {
        response.status(200).send({ user })
    })
    .catch(next)
}