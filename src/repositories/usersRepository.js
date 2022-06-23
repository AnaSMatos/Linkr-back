import bcrypt from "bcrypt";
import db from "./../config/db.js";

async function createUser(username, email, password, image) {
  try {
    const SALT = 10;
    const passwordHash = bcrypt.hashSync(password, SALT);

    const query = {
      text: `
          INSERT INTO users (username, email, password, image)
          VALUES ($1, $2, $3, $4)
          RETURNING id;
        `,
      values: [username, email, passwordHash, image],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getUserById(id) {
  try {
    const query = {
      text: `
          SELECT *
          FROM users
          WHERE id = $1;
        `,
      values: [id],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getUserByEmail(email) {
  try {
    const query = {
      text: `
          SELECT *
          FROM users
          WHERE email = $1;
        `,
      values: [email],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getUsersByUsername(username, userId) {
  try {
    const query = {
      text: `
          SELECT
            users.id,
            users.username,
            users.image,
            following."followingId"
          FROM 
            users
          LEFT JOIN
            following
          ON
            following."followingId" = users.id AND following."userId" = $2
          WHERE 
            username ILIKE ('%' || $1 || '%')
          ORDER BY
            following."createdAt" ASC;
        `,
      values: [username, userId],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function countFollowings(userId) {
  try {
    const query = {
      text: `
          SELECT COUNT(*) 
          FROM following 
          WHERE following."userId" = $1
        `,
      values: [userId],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

const usersRepository = {
  createUser,
  getUserById,
  getUserByEmail,
  getUsersByUsername,
  countFollowings,
};

export default usersRepository;
