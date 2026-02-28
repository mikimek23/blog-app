export const successResponse = (res, options = {}) => {
  const { status = 200, message = 'OK', data = null, meta } = options

  const payload = {
    success: true,
    message,
    data,
  }

  if (meta) payload.meta = meta
  return res.status(status).json(payload)
}

export const createHttpError = (status, message, extras = {}) => {
  const err = new Error(message)
  err.status = status
  Object.assign(err, extras)
  return err
}
