import db from "../config/db.js";

async function getPostsByToken(token, hashtag) {
    try {
        const hashtagsFilter = hashtag ? 
        `AND hashtags.name = '${hashtag}'` 
        : 
        "";
        return db.query(`
            SELECT posts.url,posts.message,posts.likes,posts."createdAt",hashtags.name
            FROM posts
            JOIN sessions ON posts."userId" = sessions."userId"
            LEFT JOIN "postsHashtags" ON  posts.id = "postsHashtags"."postId"
            LEFT JOIN hashtags ON "postsHashtags"."hashtagId" = hashtags.id
            WHERE sessions.token=$1 ${hashtagsFilter}
            ORDER BY posts."createdAt" DESC
            LIMIT 20
        `, [token]);
    } catch (error) {
        console.log(error);
        return error;
    }
}

const postsRepository = {
    getPostsByToken
}

export default postsRepository;