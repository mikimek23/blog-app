export const errorHandler = (err, req, res) => {
  console.error(err.stack)
  const message = err.message || 'Some thing want wrong'
  const status = err.status || 500
  res.status(status).json({
    message: message,
    success: false,
  })
}
