const db = require("../db/connection")

exports.selectCommentsByArticle = (id) => {
    return db.query(`
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `, [id])
    .then(({ rows }) => {
        return rows;
    })
};

exports.insertComment = (articleId, author, body) => {
    return db.query(`
        INSERT INTO comments
            (article_id, author, body)
        VALUES
            ($1, $2, $3)
        RETURNING *;
        `, [articleId, author, body]
    )
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not found"})
        } 
        return rows[0];
    })
}

exports.removeComment = (id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `, [id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not found"})
        }
    })
}

exports.updateComment = (commentId, voteIncrement) => {
    return db.query(`
    UPDATE comments
    SET 
        votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;
    `, [voteIncrement, commentId])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not found" })
        }
        return rows[0]
    })
}