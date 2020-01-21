const express = require("express");

const router = express.Router();

const db = require("./userDb");

const validateUser = props => (req, res, next) => {
  // do your magic!
  console.log(props);
  req.body[props]
    ? next()
    : res.status(400).json({
        success: false,
        message: `Please provide a ${props}.`
      });
};

// works
router.post("/", validateUser("name"), (req, res) => {
  // do your magic!
  const body = req.body;
  console.log(body);
  db.insert(body)
    .then(users => res.status(200).json({ success: true, users }))
    .catch(err =>
      res
        .status(500)
        .json({ success: false, errorMessage: "Could not add user." })
    );
});

//does not work - errors are "Unhandled rejection Error: SQLITE_ERROR: table users has no column named text" I think I have a disconnect on what this is asking for.
router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  // do your magic!
  const { id } = req.params;
  console.log(`post: /:id: id: `, id);
  console.log(`post: /:id: req.body: `, req.body);
  db.insert(req.body).then(post =>
    res
      .status(200)
      .json({ success: true, post })
      .catch(err =>
        res.status(500).json({ success: false, message: "Could not add post." })
      )
  );
});

//works
router.get("/", (req, res) => {
  // do your magic!
  db.get()
    .then(users => res.status(200).json({ success: true, users }))
    .catch(err =>
      res.status(500).json({ success: false, message: "Could not get users." })
    );
});

//works
router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  db.getById(id)
    .then(user => res.status(200).json({ success: true, user }))
    .catch(err => res.status(500).json({ message: "Could not get user." }));
});

//added logic to handle if user has no posts - works
router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  db.getUserPosts(id)
    .then(posts =>
      posts.length > 0
        ? res.status(200).json({ success: true, posts })
        : res
            .status(404)
            .json({ success: false, message: "User has no posts." })
    )
    .catch(err => res.status(500).json({ message: "Could not get posts." }));
});

//works
router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  db.remove(id)
    .then(user =>
      res
        .status(200)
        .json({ success: true, message: `${user} record deleted.` })
    )
    .catch(err =>
      res
        .status(500)
        .json({ success: false, message: "Could not delete user." })
    );
});

//works
router.put("/:id", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;

  db.update(id, req.body).then(updated =>
    res
      .status(201)
      .json({ success: true, message: `${updated} record updated.` })
  );
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  db.getById(id)
    .then(user => {
      console.log(`validateUserId: user: `, user);
      console.log(`validateUserId: id: `, id);
      if (typeof user === "object") {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "Invalid user ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Invalid user ID", err });
    });
}

//less dynamic method

// function validateUser(req, res, next) {
//   // do your magic!
//   const name = req.body.name;
//   name
//     ? next()
//     : res.status(400).json({
//         success: false,
//         message: "Please provide a name for the user."
//       });
// }

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
