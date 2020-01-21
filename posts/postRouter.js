const express = require("express");

const db = require("./postDb");

const router = express.Router();

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

router.get("/:id", validatePostId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  db.getById(id)
    .then(post => res.status(200).json({ success: true, post }))
    .catch(err =>
      res.status(500).json({ success: false, message: "Unable to get post" })
    );
});

router.delete("/:id", validatePostId, (req, res) => {
  // do your magic!
});

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

router.post("/", validatePost("text"), (req, res) => {
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

function validatePost(prop) {
  console.log(prop);
  return function(req, res, next) {
    console.log(req.body);
    if (req.body) {
      if (req.body[prop]) {
        next();
      } else {
        res
          .status(400)
          .json({ success: false, message: `Missing required ${prop} field.` });
      }
    } else {
      res.status(400).json({ success: false, message: "Missing post data." });
    }
  };
}

// function validatePost(req, res) {
//   // const body = req.body;
//   console.log(`validate: `, req.body);
//   if (req.body) {
//     if (req.body.text) {
//       next();
//     } else {
//       res
//         .status(400)
//         .json({ success: false, message: "Missing required text field." });
//     }
//   } else {
//     res.status(400).json({ success: false, message: "Missing post data." });
//   }
// }

module.exports = router;
