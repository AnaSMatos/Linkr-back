import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function getPosts(req, res) {
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer", "").trim();
    const { hashtag } = req.query;
    try {
        const { rows: posts } = await postsRepository.getPostsByToken(token, hashtag);
        const postData = await getMetadata(posts);
        res.status(200).send(postData);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error getPosts");
    }
}

export async function postPost(req, res) {
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer", "").trim();
    const { url, message } = req.body;
    if (!message) message = null
    try {
        const userId = await postsRepository.getUserByToken(token);

        const publish = await postsRepository.publishPost(url, message, userId.rows[0].userId);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getMetadata(posts){
    const postData = [];
    for(let i = 0; i<posts.length; i++){
        try {
            const metadata = await urlMetadata(posts[i].url);
            postData.push({...posts[i], postData:{
                postUrl: metadata.url,
                postImage: metadata.image,
                postTitle: metadata.title,
                postDescription: metadata.description
            }});
        } catch (error) {
            console.log(error);
        }
    }
    return postData;
}