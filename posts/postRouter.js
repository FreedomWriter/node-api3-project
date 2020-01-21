const express = require("express");

const db = require("./postDb");

const router = express.Router();

// works
router.get("/", (req, res) => {
  // do your magic!
  db.get()
    .then(posts => res.status(200).json({ success: true, posts }))
    .catch(err =>
      res
        .status(500)
        .json({ success: false, message: "Unable to retrieve posts." })
    );
});

// works
router.get("/:id", validatePostId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  db.getById(id)
    .then(post => res.status(200).json({ success: true, post }))
    .catch(err =>
      res.status(500).json({ success: false, message: "Unable to get post" })
    );
});

// works
router.delete("/:id", validatePostId, (req, res) => {
  // do your magic!
  db.remove(req.params.id)
    .then(removed =>
      res
        .status(200)
        .json({ success: true, message: `${removed} record removed` })
    )
    .catch(err =>
      res
        .status(500)
        .json({ success: false, message: "Could not delete post." })
    );
});

//works
router.put("/:id", validatePostId, validatePost, (req, res) => {
  // do your magic!
  db.update(req.params.id, req.body)
    .then(post => res.status(200).json({ success: true, post }))
    .catch(err => {
      console.log(err);
      req
        .status(500)
        .json({ success: false, message: "Unable to update post" });
    });
});

// works
router.post("/", validatePost, (req, res) => {
  console.log(`router.post: `, req.body);
  db.insert(req.body)
    .then(post => res.status(201).json({ success: true, post }))
    .catch(err => res.status(500).json({ success: false, message: err }));
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  db.getById(id)
    .then(post => {
      console.log(post);
      if (typeof post === "object") {
        req.post = post;
        next();
      } else {
        res.status(404).json({ message: "Invalid post ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Invalid post ID", err });
    });
}

function validatePost(req, res, next) {
  // do your magic!
  console.log(`req.body: `, req.body);
  if (Object.keys(req.body).length > 0) {
    if (req.body.text) {
      next();
    } else {
      res
        .status(400)
        .json({ success: false, message: "Missing required text field" });
    }
  } else {
    res.status(400).json({ success: false, message: "Missing post data." });
  }
}

module.exports = router;
