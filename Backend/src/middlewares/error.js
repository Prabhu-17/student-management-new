export const notFound = (req, res, next) =>
  next({ status: 404, message: 'Not Found' })

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}
