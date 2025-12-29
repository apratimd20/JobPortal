import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log('Received token:', token);
      console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_for_dev");
      console.log('Decoded token:', decoded);

      req.user = await User.findById(decoded.id).select("-password");
      console.log('Found user:', req.user ? req.user._id : 'null');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      return next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      console.error('Error name:', error.name);
      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid token",
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: "Not authorized, no token",
  });
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient role",
      });
    }
    next();
  };
};
