const { selectEndpoints } = require("../models/api.models")

exports.getEndpoints = (request, response, next) => {
    selectEndpoints()
    .then((endpoints) => {
        response.status(200).send({ endpoints })
    })
    .catch(next)
}