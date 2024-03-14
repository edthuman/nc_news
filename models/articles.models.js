const db = require("../db/connection");

exports.selectAllArticles = (topic, sort_by, order, limit, pageNumber) => {
    return db.query(`
    SELECT slug FROM topics
    `).then((response) => {
    const validTopics = response.rows.map((topic) => topic.slug)

    const validSortOptions = [
        "author",
        "title",
        "article_id",
        "topic",
        "created_at",
        "votes",
        "article_img_url",
        "comment_count",
    ];
    let topicQuery = "";
    let sortQuery = "";
    let limitQuery = "";

    if (validTopics.includes(topic)) {
        topicQuery += `WHERE topic = '${topic}'`;
    } else if (topic !== undefined) {
        return Promise.reject({ status: 404, msg: "Not found" });
    }

    if (validSortOptions.includes(sort_by)) {
        sortQuery += sort_by;
    } else if (sort_by !== undefined) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    if (order === "ASC" || order === "DESC") {
        sortQuery += " " + order;
    } else if (order !== undefined) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    if (Number(limit) > 0) {
        limitQuery += `LIMIT ${limit} OFFSET ${limit * (pageNumber - 1)}`;
    } else if (Number(limit) <= 0 && limit !== "") {
        return Promise.reject({ status: 400, msg: "Bad request" });
    } else if (limit !== undefined && limit !== "") {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    const lengthOfResults = db.query(`
    SELECT COUNT(*) FROM articles
    ${topicQuery};
    `);

    const arrayOutputQuery = db.query(`
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST (COUNT(comment_id) AS INTEGER) AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    ${topicQuery}
    GROUP BY articles.article_id
    ORDER BY ${sortQuery}
    ${limitQuery};
    `);

    return Promise.all([arrayOutputQuery, lengthOfResults]).then((response) => {
        const articles = response[0].rows;
        const total_count = Number(response[1].rows[0].count);

        return [articles, total_count];
    });
    })
};

exports.selectArticleById = (id) => {
    return db
        .query(
            `
        SELECT articles.article_id, articles.author, title, articles.body, topic, articles.created_at, articles.votes, article_img_url, CAST (COUNT(comment_id) AS INTEGER) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id
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

exports.updateArticle = (id, votesIncrement) => {
    return db
        .query(
            `
    UPDATE articles
    SET 
    votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `,
            [votesIncrement, id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.insertArticle = (author, title, body, topic, articleImgUrl) => {
    return db
        .query(
            `
    INSERT INTO articles
        (author, title, body, topic, article_img_url)
    VALUES
        ($1, $2, $3, $4, $5)
    RETURNING article_id;
    `,
            [author, title, body, topic, articleImgUrl]
        )
        .then(({ rows }) => {
            const postedArticleId = rows[0].article_id;

            return postedArticleId;
        });
};

exports.removeArticle = (id) => {
    return db.query(`
    DELETE FROM articles
    WHERE article_id = $1
    RETURNING *;
    `, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not found"})
        }
    })
};
