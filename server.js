const express = require("express");

const server = express();

const postsRouter = require("./posts/postRouter");

server.use(logger);

server.use("/api/posts", postsRouter);

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
