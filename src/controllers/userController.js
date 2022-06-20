import usersRepository from "../repositories/usersRepository.js";

export default async function getUser(req, res) {
    const { id } = req.params;
    try {
        const {rows: user} = await usersRepository.getUserById(id);
        console.log("getUser >> back: ", user)
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error getUser");
    }
}