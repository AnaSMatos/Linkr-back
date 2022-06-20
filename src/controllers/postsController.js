import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";
import hashtagRepository from "../repositories/hashtagRepository.js";

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
    const { url, message, userId, hashtags } = req.body;
    if (!message) message = null
    try {
        const publish = await postsRepository.publishPost(url, message, userId);
        await createHashtag(hashtags);
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
            return error;
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

async function createHashtag(hashtags){
    try {
        for (let i = 0; i < hashtags.length; i++) {
            const {rows}= await hashtagRepository.getHashtagsByName(hashtags[i]);
            if(rows.length>0){
                hashtags.splice(i,1);
            }
        }
        for (let i = 0; i < hashtags.length; i++) {
            await hashtagRepository.insertHashtag(hashtags[i]);
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}