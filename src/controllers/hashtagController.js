import hashtagRepository from "../repositories/hashtagRepository.js";

export default async function getHashtag(req, res) {
    try {
        const {rows:hashtags} = await hashtagRepository.getHashtags();
        res.status(200).send(hashtags);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error getPosts");
    }
}