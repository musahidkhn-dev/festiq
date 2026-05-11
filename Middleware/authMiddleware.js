import jwt, { decode } from "jsonwebtoken";
import User from "../models/userModel.js";

const forUser = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user = await User.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401);
        return next(new Error("Unauthorized Access! : User Not Found!"));
      }
      req.user = user;
      next();
    } else {
      res.status(401);
      return next(new Error("Unauthorized Access! : No Token Found!"));
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const forAdmin = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        res.status(401);
        return next(new Error("Unauthorized Access! : User Not Found!"));
      }

      req.user = user;
      if (user.isAdmin) {
        next();
      } else {
        res.status(403);
        return next(new Error("Forbidden: Admin Access Only!"));
      }
    } else {
      res.status(401);
      return next(new Error("Unauthorized Access! : No Token Found!"));
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const forCreator = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        res.status(401);
        return next(new Error("Unauthorized Access! : User Not Found!"));
      }

      req.user = user;
      if (user.isCreator || user.isAdmin) {
        next();
      } else {
        res.status(403);
        return next(new Error("Forbidden: Creator Access Only!"));
      }
    } else {
      res.status(401);
      return next(new Error("Unauthorized Access! : No Token Found!"));
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const optional = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // If token is invalid, just proceed as guest
    next();
  }
};

const protect = {forUser, forAdmin, forCreator, optional}
export default protect;
