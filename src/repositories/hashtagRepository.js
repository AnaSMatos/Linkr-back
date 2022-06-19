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

const hashtagRepository = {
    getHashtags
}

export default hashtagRepository;