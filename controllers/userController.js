exports.getMe = async (req, res, next) => {
  res.json({ user: req.user });
};
