import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

import usersRepository from "../repositories/usersRepository.js";
import sessionsRepository from "./../repositories/sessionsRepository.js";
import SessionRepository from "./../repositories/sessionsRepository.js";

export async function signUp(req, res) {
  const {name, email, password, confirmPassword} = req.body;

  try {
    
    const isUser = await usersRepository.getUserByEmail(email);
    if (!isUser)
      return res.status(409).send({message: `There is already a user with this email: ${email}.`});
    
    const SALT = 10
    const encryptedPassword = bcrypt.hashSync(password, SALT)
    usersRepository.createUser(name, email, encryptedPassword);

    res.status(201).send({message:  "SignUp successfully!"});
    console.log("SignUp successfully!");

  } catch (error) {
    
    console.log("Error creating new user.", error.message);
    res.status(500).send(error.message);

  }

}

export async function signIn(req, res) {
  console.log("signIn")
  const {email, password} = req.body;
  try {
    
    const user = await usersRepository.getUserByEmail(email);
    if (!user)
      return res.status(404).send(`There isn't a user with this email: ${email}.`);

    console.log(user.rows[0].password)
    
    if (!bcrypt.compareSync(password, user.rows[0].password))
      return res.status(401).send({message: `Wrong password!`})
    
    const token = uuid();
    const session = await sessionsRepository.createSession(user.rows[0].id, token)

    console.log(session.rows[0].id, user.rows[0].id, token)

    res.locals.user = user.id

    return res.status(201).send({sessoinId: session.rows[0].id, userId: user.rows[0].id, token})

  } catch (error) {
    
    console.log("Error getting user data.", error.message)
    res.status(500).send(error.message)

  }

}

export async function logout(req, res) {
  try {
    const { session } = res.locals;
    await SessionRepository.deleteSession(session.id, session.userId);

    res.status(200).send({ message: "Logout successfully!" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
