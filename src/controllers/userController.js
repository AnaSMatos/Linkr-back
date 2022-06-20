import UserRepository from "./../repositories/usersRepository.js";

export async function getUser(req, res) {
  const { id } = req.params;
  try {
    const { rows: user } = await UserRepository.getUserById(id);
    console.log("getUser >> back: ", user);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("error getUser");
  }
}

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
    res.sendStatus(500);
  }
}
