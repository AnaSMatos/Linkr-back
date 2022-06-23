import db from "./../config/db.js";

async function addFollower(userId, followingId) {
  return await db.query(
    ` INSERT INTO 
        following ("userId", "followingId")
      VALUES 
        ($1, $2)
      RETURNING *;`,
    [userId, followingId],
  );
}

async function removeFollower(userId, followingId) {
  return await db.query(
    ` DELETE FROM
        following
      WHERE
        "userId" = $1 AND "followingId" = $2 AND "updatedAt" IS NULL
      RETURNING *;`,
    [userId, followingId],
  );
}

async function isFollowing(userId, followingId) {
  return await db.query(
    ` SELECT 
        * 
      FROM 
        following 
      WHERE 
        "userId" = $1 AND "followingId" = $2 AND "updatedAt" IS NULL;`,
    [userId, followingId],
  );
}

const FollowingRepository = {
  addFollower,
  removeFollower,
  isFollowing,
};

export default FollowingRepository;
