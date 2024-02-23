const db = require("../db/connection")

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows;
    });
}

exports.selectTopicByName = (topic) => {
    return db.query(`
    SELECT * FROM topics
    WHERE slug = $1;
    `, [topic])
    .then(({rows}) => {
        return rows;
    });
}

exports.insertTopic = (slug, description) => {
    if (slug === undefined || description === undefined) {
        return Promise.reject({ status: 400, msg: "Bad request"})
    }
    return db.query(`
    INSERT INTO topics
        (slug, description)
    VALUES
        ($1, $2)
    RETURNING *;
    `, [slug, description])
    .then(({ rows }) => {
        return rows[0];
    })
}