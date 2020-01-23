const express = require("express");
const cors = require("cors");
const server = express();

const postsRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");

server.use(cors());
server.use(logger);
server.use(express.json());

server.use("/api/posts", postsRouter);
server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const { method, originalUrl } = req;
  const date = new Date().toISOString();
  console.log(`${method} on ${originalUrl} at ${date}`);
  next();
}

module.exports = server;
