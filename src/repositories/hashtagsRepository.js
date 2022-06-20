import db from "../config/db.js";

async function postHashtag(hashtags){
    try{
        return hashtags.forEach(tag => {
            db.query(`
                INSERT INTO hashtags (name) VALUES ($1)
            `, [tag])
        });
    }catch(error){
        console.log(error);
        return error;
    }
}

const hashtagRepository = {

}

export default hashtagRepository;
