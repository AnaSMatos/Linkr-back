import commentsRepository from "../repositories/commentsRepository.js";
import postRepository from "./../repositories/postsRepository.js";

export async function postComment(req, res) {
  const { postId, message } = req.body;
  const userId = parseInt(res.locals.user.id);

  try {
    const post = await postRepository.getPostById(postId);

    if (post.rowCount === 0)
      return res.status(404).send({ message: "Post not found" });

    await commentsRepository.leaveComment(postId, userId, message);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getComments(req, res) {
  const { postId } = req.params;

  try {
    const post = await postRepository.getPostById(postId);

    if (post.rowCount === 0)
      return res.status(404).send({ message: "Post not found" });

    const { rows: comments } = await commentsRepository.getComments(postId);

    const commentsFormated = comments.map((comment) => {
      let typeOfUser = null;

      if (comment.userId == comment.ownerUserIdOfPost)
        typeOfUser = "post's author";

      if (!typeOfUser && comment.followingId && comment.followerId)
        typeOfUser = "following";

      return {
        id: comment.id,
        postId: comment.postId,
        message: comment.message,
        user: {
          id: comment.userId,
          username: comment.username,
          image: comment.image,
          typeOfUser,
        },
      };
    });

    res.status(200).send(commentsFormated);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "error getComments" });
  }
}

export async function getContComments(req, res) {
  const { postId } = req.params;

  try {
    const post = await postRepository.getPostById(postId);

    if (post.rowCount === 0)
      return res.status(404).send({ message: "Post not found" });

    const { rows: contComments } = await commentsRepository.getContComments(
      postId,
    );

    const commentsInfo = {
      numberOfComments: parseInt(contComments[0].count || 0),
    };

    res.status(200).send(commentsInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "error getting number of comments" });
  }
}
