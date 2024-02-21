const db = require("../db/connection");

exports.selectAllArticles = (topic) => {
    const validTopics = ["mitch", "cats", "paper"]
    let topicQuery = ""

    if (validTopics.includes(topic)) {
        topicQuery += `WHERE topic = '${topic}'`
    } else if (topic !== undefined) {
        return Promise.reject({ status: 404, msg: "Not found"})
    }

    return db
        .query(`
            SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST (COUNT(comment_id) AS INTEGER) AS comment_count FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            ${topicQuery}
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC
            ;
        `)
        .then(({ rows }) => {
            return rows;
        });
};

exports.selectArticleById = (id) => {
    return db
        .query(`
        SELECT articles.article_id, articles.author, title, articles.body, topic, articles.created_at, articles.votes, article_img_url, CAST (COUNT(comment_id) AS INTEGER) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id
        `, [id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" });
            }
            return rows[0];
        });
};

exports.updateArticle = (id, votesIncrement) => {
    return db.query(`
    UPDATE articles
    SET 
    votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `, [votesIncrement, id])
    .then(({ rows }) => {
        return rows[0]
    })
}