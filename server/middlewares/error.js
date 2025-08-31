import { envMode } from "../app.js";

const errorMiddleware = (err, req, res, next) => {
  err.message ||= "Internal Server Error";

  err.statusCode ||= 500;

  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    err.statusCode = 400;
    err.message = `Duplicate field - ${error}`;
  }

  if (err.name === "CastError") {
    const errorpath = err.path;
    err.message = `Invalid Format of ${errorpath}`;
    err.statusCode = 400;
  }

  // console.log(err);
  const response = {
    success: false,
    message: err.message,
  };
  
  if (envMode === "DEVELOPMENT") {
    response.error = err;
  }

  return res.status(err.statusCode).json(response);
};

const TryCatch = (passedFunc) => async (req, res, next) => {
  try {
    await passedFunc(req, res, next);
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

export { errorMiddleware, TryCatch };
