import UserRepository from "./../repositories/usersRepository.js";

export async function getUsersBySearch(req, res) {
  try {
    const { username } = req.query;

    const users = await UserRepository.getUsersByUsername(username);

    if (users.rowCount === 0) {
      return res.status(404).send({
        message: "No users found",
      });
    }

    res.status(200).send(users.rows);
  } catch (e) {
    console.log(e);
    return e;
  }
}
