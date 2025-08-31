import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";
import { CHATTALK_TOKEN } from "../constants/config.js";
import User from "../models/user.js";

const isAuthenticated = async (req, res, next) => {
  // console.log("Cookiees :",req.cookies);

  const token = req.cookies[CHATTALK_TOKEN];
  // console.log(token);

  if (!token)
    return next(new ErrorHandler("Please login to access this route", 401));
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  //  console.log(decodedData);
  req.user = decodedData.id;

  next();
};

const adminOnly = async (req, res, next) => {

  const token = req.cookies["Chattalk-admin-token"];

  if (!token)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  // const secretKey = jwt.verify(token, process.env.JWT_SECRET);
  const {secretKey}= jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = secretKey === adminSecretKey;
  if (!isMatched) {
    return next(new ErrorHandler("Only Admin can access this route", 401));
  }

  next();
};

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);
    const authToken = socket.request.cookies[CHATTALK_TOKEN];

    if (!authToken)
      return next(new ErrorHandler("Please login to access this route", 401));
    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData.id);

    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401));

    socket.user = user;

    return next();
  } catch (err) {
    console.log(err);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};

export { isAuthenticated, adminOnly, socketAuthenticator };
