import db from "../config/db.js";

async function getPosts(hashtag) {
  try {
    const hashtagsFilter = hashtag
      ? `WHERE hashtags.name = '${hashtag} AND posts."updatedAt" IS NULL'`
      : 'WHERE posts."updatedAt" IS NULL';
    return db.query(`
    SELECT posts.id, posts.url,posts.message,posts.likes,users.username,
    users.image
    FROM posts
    JOIN users ON posts."userId" = users.id
    LEFT JOIN "postsHashtags" ON  posts.id = "postsHashtags"."postId"
    LEFT JOIN hashtags ON "postsHashtags"."hashtagId" = hashtags.id
    ${hashtagsFilter}
    GROUP BY posts.id,users.username,users.image
    ORDER BY posts."createdAt" DESC
    LIMIT 20;`);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getUserByToken(token) {
  try {
    return db.query(
      `SELECT * FROM sessions WHERE token = $1 AND "logoutDate" IS NULL`,
      [token],
    );
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getPostById(id) {
  try {
    const query = {
      text: `
        SELECT 
          * 
        FROM 
          posts 
        WHERE 
          id = $1 AND "updatedAt" IS NULL;`,
      values: [id],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function publishPost(url, message, userId) {
  try {
    return db.query(
      `
            INSERT INTO posts("userId", url, message, likes)
            VALUES ($1, $2, $3, $4);
            `,
      [userId, url, message, 0],
    );
  } catch (error) {
    console.log(error);
    return error;
  }
}

const postsRepository = {
  getPosts,
  getPostById,
  getUserByToken,
  publishPost,
};

export default postsRepository;
