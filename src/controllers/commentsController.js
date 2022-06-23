import commentsRepository from "../repositories/commentsRepository.js";
import followingRepository from "../repositories/followingRepository.js";

export async function postComment(req, res) {
    const { postId, userId, message } = req.body;
    const user = res.locals.user.id;
    try {
        let userType = NULL;
        if (userId = user) userType = "post's author";
        
        const isFollowing = followingRepository.isFollowing(user, userId);
        if (isFollowing.length != 0)
            userType = "following";
        
        const publish = await commentsRepository.leaveComment(postId, userId, userType, message);
        
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getComments(req, res){
    const { postId } = req.query;
    const userId = res.locals.user.id;
    try {

        const { rows: comments } = await commentsRepository.getComments(postId);
        console.log(comments)
        return res.status(200).send(comments);

    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "error getComments"});
    }
}

export async function getContComments(req, res) {
    try {
        const contComments = await commentsRepository.getContComments(postId);
        res.status(200).send(contComments);
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "error getting number of comments"});
    }
}