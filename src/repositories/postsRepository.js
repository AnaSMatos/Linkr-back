import db from "../config/db.js";

async function getPosts(hashtag, userId, limit, offset) {
  try {

    if (hashtag){
      const query = {
        text: `
          SELECT posts.id, posts.url, posts.message, posts.likes, users.username,
          users.image, posts."userId"
          FROM posts
          JOIN users ON posts."userId" = users.id
          LEFT JOIN "postsHashtags" ON  posts.id = "postsHashtags"."postId"
          LEFT JOIN hashtags ON "postsHashtags"."hashtagId" = hashtags.id
          WHERE hashtags.name = $1 AND posts."usersId" <> $2
          GROUP BY posts.id,users.username,users.image
          ORDER BY posts."createdAt" DESC
          LIMIT $3
          OFFSET $4;
        `,
        values: [hashtag, userId, limit, offset],
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
          following."userId" = $1
      GROUP BY 
          posts.id,
          users.username,
          users.image
      ORDER BY posts."createdAt" DESC
      LIMIT 20;
        `,
      values: [userId],
    };

    return db.query(query);

  } catch (error) {
    console.log(error);
    return error;
  }
}

<<<<<<< HEAD
=======
async function getPostByFollowings(userId) {
  try {
      return db.query(`
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
              posts."updatedAt" IS NULL AND 
              (posts."userId" = ${userId} OR following."userId" = ${userId})
          GROUP BY 
              posts.id,
              users.username,
              users.image
          ORDER BY posts."createdAt" DESC
          LIMIT 20;
      `);
  } catch (error) {
      console.log(error);
      return error;
  }
}

>>>>>>> d7147dffdba80370f2160838a69dff69d8ef5840
function getContPosts(userId){
  try {
    return db.query(`
     SELECT COUNT(id) FROM posts
    `);
  } catch (error) {
    console.log(error);
    return error;
<<<<<<< HEAD
=======

>>>>>>> d7147dffdba80370f2160838a69dff69d8ef5840
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
  try{
    return db.query(`
      DELETE FROM posts WHERE id = $1;
    `, [id]);
  }catch(error){
    console.log(error);
    return error;
  }
}

async function removeHastags(id){
  try{
    return db.query(`
      DELETE FROM "postsHashtags" WHERE "postId" = $1;
    `, [id]);
  }catch(error){
    console.log(error);
    return error;
  }
}

async function removeLikes(id){
  try{
    return db.query(`
      DELETE FROM likes WHERE "postId" = $1;
    `, [id]);
  }catch(error){
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
  getPostsIdByUserId,
  getContPosts,
  removePost,
  removeHastags,
  removeLikes
};

export default postsRepository;
