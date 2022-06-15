import postsRepository from "../repositories/postsRepository.js";

export async function getPosts(req,res){
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

export async function postPost(req, res){
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer", "").trim();
    const {url, message} = req.body;
    if(!message) message = null
    try{
        const userId = await postsRepository.getUserByToken(token);

        const publish = await postsRepository.publishPost(url, message, userId.rows[0].userId);

        res.sendStatus(201);
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}