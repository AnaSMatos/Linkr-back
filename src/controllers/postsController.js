import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";
import hashtagRepository from "../repositories/hashtagRepository.js";
import usersRepository from "../repositories/usersRepository.js";

export async function getPosts(req, res) {
    const { hashtag, limit, offset } = req.query;
    const userId = res.locals.user.id;
    try {

        const result = await usersRepository.countFollowings(userId);
        const counter = result.rows[0].count;
        if (counter == 0){
            console.log("Primeiro if");
            return res.status(200).send("-1");
        }

        const { rows: posts } = await postsRepository.getPosts(hashtag, userId, limit, offset);
        const postData = await getMetadata(posts);
        return res.status(200).send(postData);

    } catch (error) {
        console.log(error);
        return res.status(500).send("error getPosts");
    }
}

export async function getNewPosts(req, res) {
    try {
        const { rows } = await postsRepository.getContPosts();
        const contPosts = rows[0];
        res.status(200).send(contPosts.count);
    } catch (error) {
        console.log(error);
        return res.status(500).send("error getNewPosts");
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
        return res.status(500).send("error getUserPosts");
    }
}

export async function postPost(req, res) {
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer", "").trim();
    const { url, message, userId, hashtags } = req.body;
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

async function getMetadata(posts) {
    try {
        const postPromisse = [];
        for (let i = 0; i < posts.length; i++) {
            const metadata = urlMetadata(posts[i].url);
            postPromisse.push(metadata);
        }
        const postMetadata = await Promise.all(postPromisse);
        const postData = [];
        for (let i = 0; i < postMetadata.length; i++) {
            postData.push({
                ...posts[i], postData: {
                    postUrl: postMetadata[i].url,
                    postImage: postMetadata[i].image,
                    postTitle: postMetadata[i].title,
                    postDescription: postMetadata[i].description
                }
            });
        }
        return postData;
    } catch (error) {
        console.log(error);
        console.log("error getMetadata");
        return error;
    }
}

async function createHashtag(hashtags) {
    try {
        for (let i = 0; i < hashtags.length; i++) {
            const { rows } = await hashtagRepository.getHashtagsByName(hashtags[i]);
            if (rows.length > 0) {
                hashtags.splice(i, 1);
            }
        }
        for (let i = 0; i < hashtags.length; i++) {
            await hashtagRepository.insertHashtag(hashtags[i]);
        }
    } catch (error) {
        console.log(error);
        console.log("error createHashtag");
        return error;
    }
}

export async function deletePost(req, res){
    const { postId } = req.params;
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer", "").trim();
    try {
        const userId = await postsRepository.getUserByToken(token);
        const post = await postsRepository.getPostById(postId);

        if(userId.rows[0].userId !== post.rows[0].userId){
            return res.status(401).send("You can't delete this post");
        }

        await postsRepository.removeHastags(postId);
        await postsRepository.removeLikes(postId)
        await postsRepository.removePost(postId);
        res.send("Your post was deleted").status(200);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function updatePost(req, res){
    const {postId, message} = req.body;
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer", "").trim();

    try {
        const userId = await postsRepository.getUserByToken(token);
        const post = await postsRepository.getPostById(postId);

        if(userId.rows[0].userId !== post.rows[0].userId){
            return res.status(401).send("You can't delete this post");
        }

        await postsRepository.updatePost(postId, message);
        res.send("Your post was updated").status(200);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}