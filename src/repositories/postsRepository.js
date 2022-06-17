import db from "../config/db.js";

async function getPostsByToken(token, hashtag) {
    try {
        const hashtagsFilter = hashtag ? 
        `WHERE hashtags.name = '${hashtag}'` 
        : 
        "";
        return db.query(`
            SELECT posts.url,posts.message,posts.likes,users.username,
            users.image
            FROM posts
            JOIN users ON posts."userId" = users.id
            LEFT JOIN "postsHashtags" ON  posts.id = "postsHashtags"."postId"
            LEFT JOIN hashtags ON "postsHashtags"."hashtagId" = hashtags.id
            ${hashtagsFilter}
            GROUP BY posts.id,users.username,users.image
            ORDER BY posts."createdAt" DESC
            LIMIT 20
        `);
        
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getUserByToken(token){
    try{
        return db.query(`
            SELECT * from sessions WHERE token=$1
        `, [token]);
    }catch(error){
        console.log(error);
        return error;
    }
}

async function publishPost(url, message, userId) {
    try{
        return db.query(`
            INSERT INTO posts("userId", url, message, likes, "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6)
            `, [userId, url, message, 0, new Date(), new Date()]);
    }catch(error){
        console.log(error);
        return error;
    }
}

const postsRepository = {
    getPostsByToken,
    getUserByToken,
    publishPost
}

export default postsRepository;
