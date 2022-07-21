module.exports = (req, res) => {
  res.status(404).json({ message: "Address not found." });
};
