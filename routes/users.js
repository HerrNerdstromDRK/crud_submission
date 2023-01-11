const express = require("express");
const router = express.Router();

// /users is default for this router
router.get("/", (req, res) => {
  res.send("User List");
});

router.post("/", (req, res) => {
  res.send("Create User");
});

router.get("/new", (req, res) => {
  res.send("User New Form");
});

// Order is important since this is a dynamic route (:id)
router
  .route("/:id")
  .get((req, res) => {
    res.send(
      `Get user with ID ${req.params.id}; user.name: ${req.user.name}, user.isLoggedIn: ${req.user.isLoggedIn}`
    );
  })
  .put((req, res) => {
    res.send(`Update user with ID ${req.params.id}`);
  })
  .delete((req, res) => {
    res.send(`Delete user with ID ${req.params.id}`);
  });

const users = [
  { name: "Dan", isLoggedIn: false },
  { name: "Ali", isLoggedIn: false },
];

// Middleware that gets called any time a user passes ID to a path
router.param("id", (req, res, next, id) => {
  console.log(`users:param> ID: ${id}`);
  // Call the next module in the middleware chain
  if (users[id] != null) {
    req.user = users[id];
  } else {
    console.log(`users.param> Invalid user id`);
    req.user = {};
  }
  next();
});

// Export the router for use in other files (index.js)
module.exports = router;
