const { User } = require("../models");
const createError = require("../services/createError");
const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    if (
      !bearerHeader ||
      bearerHeader.split(" ")[0] !== "Bearer" ||
      !bearerHeader.split(" ")[1] ||
      bearerHeader.split(" ")[1] === "null"
    ) {
      createError("You are unauthorized", 401);
    }
    const token = bearerHeader.split(" ")[1];

    const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
    const email = decoded.email;
    if (!email) createError("You are unauthorized", 401);
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: "password" },
    });
    if (!user) createError("You are unauthorized", 401);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
