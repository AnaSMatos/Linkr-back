import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function getPosts(req, res) {
    const { hashtag } = req.query;
    try {
        const { rows: posts } = await postsRepository.getPosts(hashtag);
        const postData = await getMetadata(posts);
        res.status(200).send(postData);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error getPosts");
    }
}

export async function getUserPosts(req, res) {
    const { userId } = req.params;
    try {
        const { rows: posts } = await postsRepository.getPostByUser(userId);
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
    const { url, message, userId } = req.body;
    if (!message) message = null
    try {
        const publish = await postsRepository.publishPost(url, message, userId);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getPostsByUser(req, res) {
    const { userId } = req.params;

    try {
        const { rows: posts } = await postsRepository.getPostsByUser(userId);
        const postData = await getMetadata(posts);
        res.status(200).send(postData);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error getPosts");
    }
}

async function getMetadata(posts){
    const postPromisse = [];
    for(let i = 0; i<posts.length; i++){
        try {
            const metadata = urlMetadata(posts[i].url);
            postPromisse.push(metadata);
        } catch (error) {
            console.log(error);
        }
    }
    const postMetadata = await Promise.all(postPromisse);
    const postData = [];
    for(let i = 0; i<postMetadata.length; i++){
        postData.push({...posts[i], postData:{
            postUrl: postMetadata[i].url,
            postImage: postMetadata[i].image,
            postTitle: postMetadata[i].title,
            postDescription: postMetadata[i].description
        }});
    }
    return postData;
}