export const errorHandler = (err, _req, res) => {
  const status = err.status || err.statusCode || 500
  const code =
    err.code ||
    (err.name === 'UnauthorizedError'
      ? 'UNAUTHORIZED'
      : 'INTERNAL_SERVER_ERROR')

  const message =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error'

  if (status >= 500) {
    console.error(err)
  }

  return res.status(status).json({
    success: false,
    message,
    code,
    errors: err.errors || undefined,
  })
}
