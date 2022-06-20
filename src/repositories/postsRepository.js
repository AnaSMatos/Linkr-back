import db from "../config/db.js";

async function getPosts(hashtag) {
  try {
    console.log(hashtag);
    const hashtagsFilter = hashtag
      ? `WHERE hashtags.name = '${hashtag}' AND posts."updatedAt" IS NULL`
      : 'WHERE posts."updatedAt" IS NULL';

    return db.query(`
      SELECT posts.id, posts.url, posts.message, posts.likes, users.username,
      users.image, posts."userId"
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

function getPostsIdByUserId(userId){
  try {
    return db.query(`
     SELECT * FROM posts WHERE "userId"=$1 
     ORDER BY "createdAt" DESC
     LIMIT 1
    `,[userId]);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getUserByToken(token) {
  try {
    return db.query(
      `
      SELECT 
        * 
      FROM 
        sessions 
      WHERE 
        token = $1 AND "logoutDate" IS NULL;`,
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

async function getPostsByUserId(userId) {
  try {
    return db.query(
      `
      SELECT 
        posts.id, 
        posts.url,
        posts.message,
        posts.likes,
        users.id AS "userId",
        users.username,
        users.image
      FROM 
        posts
      JOIN 
        users 
      ON 
        posts."userId" = users.id
      LEFT JOIN 
        "postsHashtags" 
      ON  
        posts.id = "postsHashtags"."postId"
      LEFT JOIN 
        hashtags 
      ON 
        "postsHashtags"."hashtagId" = hashtags.id
      WHERE 
        posts."userId" = $1 AND "updatedAt" IS NULL
      GROUP BY 
        posts.id, users.username, users.image, users.id
      ORDER BY 
        posts."createdAt" DESC
      LIMIT 20;`,
      [userId],
    );
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getPostByUser(userId) {
  try {
    return db.query(`
      SELECT posts.id, posts.url, posts.message, posts.likes, users.username,
      users.image, posts."userId"
      FROM posts
      JOIN users ON posts."userId" = users.id
      LEFT JOIN "postsHashtags" ON  posts.id = "postsHashtags"."postId"
      LEFT JOIN hashtags ON "postsHashtags"."hashtagId" = hashtags.id
      WHERE posts."updatedAt" IS NULL AND posts."userId" = '${userId}'
      GROUP BY posts.id,users.username,users.image
      ORDER BY posts."createdAt" DESC
      LIMIT 20;`);
  } catch (error) {
    console.log(error);
    return error;
  }
  /* try {
    const query = {
      text: `
        SELECT 
          * 
        FROM 
          posts 
        WHERE 
          "userId" = $1 AND "updatedAt" IS NULL;`,
      values: [userId],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  } */
}

async function publishPost(url, message, userId) {
  try {
    return db.query(
      `
      INSERT INTO 
        posts("userId", url, message, likes)
      VALUES 
        ($1, $2, $3, $4);
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
  getPostsByUserId,
  getUserByToken,
  getPostByUser,
  publishPost,
  getPostsIdByUserId
};

export default postsRepository;
