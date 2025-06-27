

//Handles requests for routes that do not exist.
// It creates a 404 error and passes it to the next error handling middleware.
const routeNotFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};


//A general-purpose error handler that catches all errors.
// It sets a proper status code and sends a JSON response.
// It also hides the error stack in production for security.
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // If Mongoose not found error, set to 404 and change message
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { routeNotFound, errorHandler };
