class AppError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
function errorHandler(err, req, res, next) {
  const { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).json({ statusCode, message });
}

module.exports = { AppError, errorHandler };
