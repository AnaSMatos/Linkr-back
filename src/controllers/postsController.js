import postsRepository from "../repositories/postsRepository.js";

export default async function getPosts(req,res){
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer", "").trim();
    const {hashtag} = req.query;
    try {
        const {rows:posts} = await postsRepository.getPostsByToken(token,hashtag);
        res.status(200).send(posts);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error getPosts");
    }
}