import db from "../config/bd.js";

async function getComments(postId){
    try {
        const query = {
            text: `
                SELECT "userId", "postId", "userType", "message"
                FROM comments
                WHERE 
                    "postId" = $1
            `,
            values: [postId]
        };
      return db.query(query);
    } catch (error) {
      console.log(error);
      return error;
    }
}

async function leaveComment(postId, userId, userType, message){
    try {
        const query = {
            text: `
                INSERT INTO comments ("userId", "postId", "userType", "message")
                VALUES 
                    ($1, $2, $3, $4)
            `,
            values: [postId, userId, userType, message]
        };
      return db.query(query);
    } catch (error) {
      console.log(error);
      return error;
    }
}

function getContComments(postId){
    try {
        const query = {
            text: `
                SELECT COUNT(*) 
                FROM comments
                WHERE 
                    "postId" = $1
            `,
            values: [postId]
        };
      return db.query(query);
    } catch (error) {
      console.log(error);
      return error;
    }
}

const commentsRepository = {
    leaveComment,
    getComments,
    getContComments
};

export default commentsRepository;