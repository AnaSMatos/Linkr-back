import db from "../config/db.js";

async function getHashtags() {
    try {
        return await db.query(`
            SELECT hashtags.name from hashtags
        `);
    } catch (error) {
        console.log(error);
        return error;
    }
}
async function getHashtagsByName(name) {
    try {
        return await db.query(`
            SELECT hashtags.name,hashtags.id from hashtags 
            WHERE hashtags.name=$1
        `, [name]);
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function insertHashtag(name) {
    try {
        return await db.query(`
            INSERT INTO hashtags (name) VALUES($1);
        `, [name]);
    } catch (error) {
        console.log(error);
        return error;
    }
}
async function insertPostHashtags(postId, hashtagId) {
    try {
        return await db.query(`
            INSERT INTO "postsHashtags" ("postId","hashtagId") 
            VALUES($1,$2);
        `, [postId,hashtagId]);
    } catch (error) {
        console.log(error);
        return error;
    }
}

const hashtagRepository = {
    getHashtags,
    getHashtagsByName,
    insertHashtag,
    insertPostHashtags
}

export default hashtagRepository;