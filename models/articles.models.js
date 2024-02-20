const db = require("../db/connection");

exports.selectAllArticles = (request, response, next) => {
    return db
        .query(
            `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST (COUNT(comment_id) AS INTEGER) AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.selectArticleById = (id) => {
    return db
        .query(
            `
    SELECT * FROM articles
    WHERE article_id = $1
    `,
            [id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" });
            }
            return rows[0];
        });
};