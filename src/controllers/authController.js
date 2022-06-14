import SessionRepository from "./../repositories/sessionsRepository.js";

export async function signUp(req, res) {}

/**
 * Quando fizer o signIn, tem que retorna para o front os seguintes
 * dados: id da sessão, id do usuário, e o token gerado.
 *
 * Esses dados vão ser necessários no logout, para invalidar a sessão.
 *
 * Para gerar o token, use a lib "uuid"
 * Para gerar o hash, use a lib "bcrypt"
 */
export async function signIn(req, res) {}

export async function logout(req, res) {
  try {
    const { session } = res.locals;
    await SessionRepository.deleteSession(session.id, session.userId);

    res.status(200).send({ message: "logout successfully!" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
