CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  username TEXT NOT NULL,
  image TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id),
  url TEXT NOT NULL,
  message TEXT,
  likes INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

CREATE TABLE hashtags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

CREATE TABLE "postsHashtags" (
  id SERIAL PRIMARY KEY,
  "postId" INTEGER NOT NULL REFERENCES posts(id),
  "hashtagId" INTEGER NOT NULL REFERENCES hashtags(id),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id),
  "postId" INTEGER NOT NULL REFERENCES posts(id),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id),
  token TEXT NOT NULL,
  "loginDate" TIMESTAMP NOT NULL DEFAULT NOW(),
  "logoutDate" TIMESTAMP
);