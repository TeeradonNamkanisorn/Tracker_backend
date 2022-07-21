const router = require("express").Router();
const userController = require("../controllers/userController");
router.get("/self", userController.getMe);

module.exports = router;
