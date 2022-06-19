import db from "./../config/db.js";

async function createLike(postId, userId) {
  try {
    const query = {
      text: `
        INSERT INTO likes("postId", "userId")
        VALUES ($1, $2)
        RETURNING *
      `,
      values: [postId, userId],
    };
    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function removeLike(postId, userId) {
  try {
    const query = {
      text: `
        UPDATE 
          likes
        SET
          "updatedAt" = now()
        WHERE 
          "postId" = $1 AND "userId" = $2
        RETURNING *;
      `,
      values: [postId, userId],
    };
    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getUserLikeThisPost(postId, userId) {
  try {
    const query = {
      text: `
        SELECT 
          *
        FROM
          likes
        WHERE
          "postId" = $1 AND "userId" = $2 AND "updatedAt" IS NULL;
      `,
      values: [postId, userId],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getLikesOfAPost(postId) {
  try {
    const query = {
      text: `
        SELECT 
          COALESCE(SUM(likes.likes), 0)::INTEGER AS likes
        FROM 
          likes 
        WHERE 
          postId = $1 AND "updatedAt" IS NULL;`,
      values: [postId],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getUsersWhoLikedAPost(postId) {
  try {
    const query = {
      text: `
        SELECT
          users.id,
          users.username
        FROM 
          likes
        JOIN
          users 
        ON 
          likes."userId" = users.id
        WHERE
          likes."postId" = $1 AND likes."updatedAt" IS NULL;`,
      values: [postId],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

const LikesRepository = {
  createLike,
  removeLike,
  getUserLikeThisPost,
  getLikesOfAPost,
  getUsersWhoLikedAPost,
};

export default LikesRepository;
