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