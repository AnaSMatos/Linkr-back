import hashtagRepository from "../repositories/hashtagRepository.js";
import postsRepository from "../repositories/postsRepository.js";

export async function getHashtag(req, res) {
    try {
        const {rows:hashtags} = await hashtagRepository.getHashtags();
        res.status(200).send(hashtags);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error getPosts");
    }
}
export async function postHashtag(req, res) {
    try {
        const { userId, hashtags } = req.body;
        const {rows:post} = await postsRepository.getPostsIdByUserId(userId);
        for(let i=0; i<hashtags.length; i++){
            const{rows:hashtag} = await hashtagRepository.getHashtagsByName(hashtags[i]);
            await hashtagRepository.insertPostHashtags(post[0].id,hashtag[0].id);
        }
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error getPosts");
    }
}