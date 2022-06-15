import db from "./../config/db.js";

async function createSession(userId, token) {
  try {
    const query = {
      text: `
          INSERT INTO sessions ("userId", token)
          VALUES ($1, $2, $3, $4)
          RETURNING id, "userId", token, loginDate, logoutDate;
        `,
      values: [userId, token, new Date(), new Date()],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function deleteSession(id, userId) {
  try {
    const query = {
      text: `
          UPDATE sessions
          SET "logoutDate" = NOW()
          WHERE id = $1 AND "logoutDate" IS NULL AND "userId" = $2;
        `,
      values: [id, userId],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getSessionById(id) {
  try {
    const query = {
      text: `
          SELECT *
          FROM sessions
          WHERE id = $1 AND "logoutDate" IS NULL;
        `,
      values: [id],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getSessionByUserId(userId) {
  try {
    const query = {
      text: `
          SELECT *
          FROM sessions
          WHERE "userId" = $1 AND "logoutDate" IS NULL;
        `,
      values: [userId],
    };

    return db.query(query);
  } catch (error) {
    console.log(error);
    return error;
  }
}

const sessionsRepository = {
  createSession,
  deleteSession,
  getSessionById,
  getSessionByUserId,
};

export default sessionsRepository;
