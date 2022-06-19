import PostRepository from "./../repositories/postsRepository.js";
import LikeRepository from "./../repositories/likesRepository.js";

export async function addLike(req, res) {
  try {
    const { postId } = req.params;
    const { user } = res.locals;

    const post = await PostRepository.getPostById(postId);

    if (post.rowCount === 0) {
      return res.status(404).send({
        message: "Post not found",
      });
    }

    const userLiked = await LikeRepository.getUserLikeThisPost(postId, user.id);

    if (userLiked.rowCount === 0) {
      await LikeRepository.createLike(postId, user.id);
    }

    const allUsersLiked = await LikeRepository.getUsersWhoLikedAPost(postId);

    const anotherUsers = allUsersLiked.rows.filter(
      (anotherUser) => anotherUser.id != user.id,
    );
    const usersWhoLiked = anotherUsers.map((user) => ({
      id: user.id,
      username: user.username,
    }));

    const likesInfo = {
      username: user.username,
      thisUserLiked: true,
      likesCount: allUsersLiked.rows.length || 0,
      usersWhoLiked: usersWhoLiked || [],
    };

    res.status(201).send(likesInfo);
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function removeLike(req, res) {
  try {
    const { postId } = req.params;
    const { user } = res.locals;

    const post = await PostRepository.getPostById(postId);

    if (post.rowCount === 0) {
      return res.status(404).send({
        message: "Post not found",
      });
    }

    const userLiked = await LikeRepository.getUserLikeThisPost(postId, user.id);

    if (userLiked.rowCount > 0) {
      await LikeRepository.removeLike(postId, user.id);
    }

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getInfoLikes(req, res) {
  try {
    const { postId } = req.params;
    const { user } = res.locals;

    const post = await PostRepository.getPostById(postId);

    if (post.rowCount === 0) {
      return res.status(404).send({
        message: "Post not found",
      });
    }

    const userLiked = await LikeRepository.getUserLikeThisPost(postId, user.id);

    const allUsersLiked = await LikeRepository.getUsersWhoLikedAPost(postId);

    const anotherUsers = allUsersLiked.rows.filter(
      (anotherUser) => anotherUser.id != user.id,
    );
    const usersWhoLiked = anotherUsers.map((user) => ({
      id: user.id,
      username: user.username,
    }));

    const likesInfo = {
      username: user.username,
      thisUserLiked: userLiked.rowCount > 0,
      likesCount: allUsersLiked.rows.length || 0,
      usersWhoLiked: usersWhoLiked || [],
    };

    res.status(200).send(likesInfo);
  } catch (error) {
    console.log(error);
    return error;
  }
}
