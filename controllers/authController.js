const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createError = require("../services/createError");
const { User } = require("../models");

exports.register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email) createError("Please provide the email.", 400);
    if (!password) createError("Password is required", 400);
    if (!username) createError("Username is required", 400);

    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!reg.test(password))
      createError(
        "The password must have minimum eight characters, at least one uppercase letter, one lowercase letter and one number."
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15d",
    });

    await User.create({ email, username, password: hashedPassword });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    console.log(user);
    if (!user) createError("Invalid email or password", 400);
    const correct = await bcrypt.compare(password, user.password);
    if (!correct) createError("Invalid email or password", 400);

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15d",
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
