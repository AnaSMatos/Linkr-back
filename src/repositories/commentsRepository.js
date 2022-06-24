import db from "./../config/db.js";

async function getComments(postId) {
  try {
    const query = {
      text: `
                SELECT
                  comments.id,
                  comments."userId",
                  comments."postId",
                  comments."message",
                  users."username",
                  users.image,
                  posts."userId" AS "ownerUserIdOfPost",
                  following."userId" AS "followingId",
                  following."followingId" AS "followerId"
                FROM 
                  comments
                JOIN
                  users
                ON
                  comments."userId" = users."id"
                JOIN
                  posts
                ON
                  comments."postId" = posts.id
                LEFT JOIN
                  following
                ON
                  following."userId" = comments."userId" AND following."followingId" = posts."userId"
                WHERE 
                  comments."postId" = $1
                ORDER BY
                  comments."createdAt" ASC;
            `,
      values: [postId],
    };
    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function leaveComment(postId, userId, message) {
  try {
    const query = {
      text: `
                INSERT INTO 
                  comments ("postId", "userId", "message")
                VALUES 
                    ($1, $2, $3);
            `,
      values: [postId, userId, message],
    };
    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

function getContComments(postId) {
  try {
    const query = {
      text: `
                SELECT COUNT(*) 
                FROM comments
                WHERE 
                    "postId" = $1
            `,
      values: [postId],
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
  getContComments,
};

export default commentsRepository;
