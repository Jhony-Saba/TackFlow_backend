const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Use the response status if set, otherwise default to 500
  const statusCode = res.statusCode || 500;

  switch (statusCode) {
    case 400:
      res.json({
        title: "Bad Request",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case 401:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case 403:
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case 404:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case 409:
      res.json({
        title: "Conflict",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case 500:
      res.json({
        title: "Internal Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    default:
      res.json({
        title: "Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
  }
};

module.exports = errorHandler;
