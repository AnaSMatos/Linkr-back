import { validate as uuidValidate } from "uuid";
import SessionRepository from "./../repositories/sessionsRepository.js";

export async function authValidator(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1]?.trim();

  if (!token) {
    return res.status(401).send({
      message: "You must be logged in to do this.",
    });
  }

  if (!uuidValidate(token)) {
    return res.status(401).send({
      message: "Invalid token.",
    });
  }

  try {
    const { userId } = req.body;
    const session = await SessionRepository.getSessionByUserId(userId);

    if (session.rowCount === 0) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.rows[0].token !== token) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    if (session.rows[0].userId !== userId) {
      return res.status(401).json({
        message: "This user does not own this session",
      });
    }

    res.locals.session = session.rows[0];

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
