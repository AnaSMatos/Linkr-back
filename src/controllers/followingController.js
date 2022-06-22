import FollowingRepository from "./../repositories/followingRepository.js";

export async function addFollower(req, res) {
  try {
    const userId = parseInt(res.locals.user.id);
    const followingId = parseInt(req.params.id);

    if (userId === followingId) {
      return res.sendStatus(422);
    }

    await FollowingRepository.addFollower(userId, followingId);

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
  }
}

export async function removeFollower(req, res) {
  try {
    const userId = parseInt(res.locals.user.id);
    const followingId = parseInt(req.params.id);

    if (userId === followingId) {
      return res.sendStatus(422);
    }

    await FollowingRepository.removeFollower(userId, followingId);

    res.sendStatus(204);
  } catch (e) {
    console.log(e);
  }
}

export async function isFollowing(req, res) {
  try {
    const userId = parseInt(res.locals.user.id);
    const followingId = parseInt(req.params.id);

    if (userId === followingId) {
      return res.send({ following: false, myself: true });
    }

    const following = await FollowingRepository.isFollowing(
      userId,
      followingId,
    );

    if (following.rowCount === 0) {
      return res.send({ following: false, myself: false });
    }

    res.send({ following: true, myself: false });
  } catch (e) {
    console.log(e);
  }
}
