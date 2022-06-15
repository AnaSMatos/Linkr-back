import bcrypt from "bcrypt";
import db from "./../config/db.js";

async function createUser(username, email, password, image) {
  try {
    const SALT = 10;
    const passwordHash = await bcrypt.hash(password, SALT);

    const query = {
      text: `
          INSERT INTO users (username, email, password, image, createdAt, updatedAt)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id;
        `,
      values: [username, email, passwordHash, image, new Date(), new Date()],
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

const usersRepository = {
  createUser,
  getUserById,
  getUserByEmail,
};

export default usersRepository;
