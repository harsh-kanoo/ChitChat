const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  } else {
    return res.status(400).json({ message: "Not authorized, no token" });
  }
};

module.exports = { authenticateUser };
