const buckets = new Map()

const getBucketKey = (req, keyPrefix) => {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown-ip'
  return `${keyPrefix}:${ip}`
}

export const createRateLimiter = ({
  keyPrefix,
  windowMs,
  max,
  message = 'Too many requests',
}) => {
  return (req, res, next) => {
    const now = Date.now()
    const key = getBucketKey(req, keyPrefix)
    const current = buckets.get(key)

    if (!current || current.expiresAt <= now) {
      buckets.set(key, { count: 1, expiresAt: now + windowMs })
      return next()
    }

    if (current.count >= max) {
      return res.status(429).json({
        success: false,
        message,
        code: 'RATE_LIMIT_EXCEEDED',
      })
    }

    current.count += 1
    buckets.set(key, current)
    return next()
  }
}
