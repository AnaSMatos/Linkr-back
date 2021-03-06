import db from "../config/db.js";

async function getPosts(hashtag, userId, limit, offset) {
  try {
    if (hashtag) {
      const query = {
        text: `
          SELECT posts.id, posts.url, posts.message, posts.likes, users.username,
          users.image, posts."userId"
          FROM posts
          JOIN users ON posts."userId" = users.id
          LEFT JOIN "postsHashtags" ON  posts.id = "postsHashtags"."postId"
          LEFT JOIN hashtags ON "postsHashtags"."hashtagId" = hashtags.id
          WHERE hashtags.name = $1 AND posts."userId" <> $4
          GROUP BY posts.id,users.username,users.image
          ORDER BY posts."createdAt" DESC
          LIMIT $2
          OFFSET $3;
        `,

        values: [hashtag, limit, offset, userId],
      };

      return db.query(query);
    }

    const query = {
      text: `
      SELECT 
          posts.id, 
          posts.url, 
          posts.message, 
          posts.likes, 
          users.username,
          users.image, 
          posts."userId"
      FROM posts
      JOIN users ON posts."userId" = users.id
      LEFT JOIN following ON following."followingId" = posts."userId"
      WHERE 
          following."userId" = $3
      GROUP BY 
          posts.id,
          users.username,
          users.image
      ORDER BY posts."createdAt" DESC
      LIMIT $1
      OFFSET $2;
        `,

      values: [limit, offset, userId],
    };
    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

function getContPosts(userId) {
  try {
    return db.query(`
      SELECT COUNT(id) FROM posts
    `);
  } catch (error) {
    console.log(error);
    return error;
  }
}

function getPostsIdByUserId(userId) {
  try {
    return db.query(
      `
     SELECT * FROM posts WHERE "userId"=$1 
     ORDER BY "createdAt" DESC
     LIMIT 1
    `,
      [userId],
    );
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
          id = $1;`,
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

async function getPostByUser(userId,limit, offset) {
  try {
    return db.query(`
      SELECT posts.id, posts.url, posts.message, posts.likes, users.username,
      users.image, posts."userId"
      FROM posts
      JOIN users ON posts."userId" = users.id
      LEFT JOIN "postsHashtags" ON  posts.id = "postsHashtags"."postId"
      LEFT JOIN hashtags ON "postsHashtags"."hashtagId" = hashtags.id
      WHERE posts."updatedAt" IS NULL AND posts."userId" = $1
      GROUP BY posts.id,users.username,users.image
      ORDER BY posts."createdAt" DESC
      LIMIT $2
      OFFSET $3;`,[userId,limit,offset]);
  } catch (error) {
    console.log(error);
    return error;
  }
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

async function removePost(id) {
  try {
    return db.query(
      `
      DELETE FROM posts WHERE id = $1;
    `,
      [id],
    );
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function removeHastags(id) {
  try {
    return db.query(
      `
      DELETE FROM "postsHashtags" WHERE "postId" = $1;
    `,
      [id],
    );
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function removeLikes(id) {
  try {
    return db.query(
      `
      DELETE FROM likes WHERE "postId" = $1;
    `,
      [id],
    );
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function sharePost(userId, postId){
  try{
    return(
      db.query(`
        INSERT INTO reposts("userId", "postId")
        VALUES ($1, $2)
      `, [userId, postId])
    )
  }catch(error){
    console.log(error);
    return error;
  }
}

async function getNumberReposts(postId){
  try{
    return db.query(`
      SELECT posts.id, COUNT(reposts."postId") AS reposts 
      FROM posts
      LEFT JOIN reposts ON posts.id = reposts."postId"
      WHERE posts.id = ($1)
      GROUP BY posts.id
    `, [postId])
  }catch(error){
    console.log(error);
    return error
  }
}

async function getReposts(){
  try{
    return db.query(`
    SELECT 
      posts.id,
      posts.url,
      posts.message,
      posts.likes,
      u1.id AS "userId",
      u1.username,
      u1.image,
      u2.id AS "repostedById",
      u2.username AS "repostedByUsername",
      reposts."createdAt"
    FROM posts
    LEFT JOIN reposts ON posts.id = reposts."postId"
    LEFT JOIN following ON following."followingId" = posts."userId"
    JOIN users u1 ON reposts."userId" = u1.id
    JOIN users u2 ON posts."userId" = u2.id
    WHERE 
    following."userId" = 2
    GROUP BY posts.id, u1.id, u2.id, reposts."createdAt"
    `)
  }catch(error){
    console.log(error)
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
  getPostsIdByUserId,
  getContPosts,
  removePost,
  removeHastags,
  removeLikes,
  sharePost,
  getNumberReposts,
  getReposts
};

export default postsRepository;
