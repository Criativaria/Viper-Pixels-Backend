const router = require('express').Router();
const UserController = require("../controllers/userController");
const AuthPermission = require('../middleware/authPermission');

router.get("/", (req, res) => UserController.getUsers(req, res));
router.post("/", (req, res) => UserController.postUsers(req, res));
router.patch("/:id", (req, res) => UserController.patchUsers(req, res));
router.delete("/:id", (req, res) => UserController.deleteUsers(req, res));

module.exports = router;
