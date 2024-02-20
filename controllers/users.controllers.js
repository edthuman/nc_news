const { selectAllUsers } = require("../models/users.models")

exports.getUsers = (request, response, next) => {
    selectAllUsers()
    .then((users) => {
        response.status(200).send({ users })
    })
}