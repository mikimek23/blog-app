const toNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback
  return String(value).toLowerCase() === 'true'
}

export const getEnv = () => {
  const nodeEnv = process.env.NODE_ENV || 'development'
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'

  return {
    nodeEnv,
    isProduction: nodeEnv === 'production',
    port: toNumber(process.env.PORT, 5001),
    databaseUrl: process.env.DATABASE_URL || '',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    cloudinaryName: process.env.CLOUDINARY_NAME || '',
    cloudinaryKey: process.env.CLOUDINARY_KEY || '',
    cloudinarySecret: process.env.CLOUDINARY_SECRET || '',
    corsOrigins: corsOrigin
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    cookieDomain: process.env.COOKIE_DOMAIN || undefined,
    authRateLimitWindowMs: toNumber(
      process.env.AUTH_RATE_LIMIT_WINDOW_MS,
      60000,
    ),
    authRateLimitMax: toNumber(process.env.AUTH_RATE_LIMIT_MAX, 10),
    apiRateLimitWindowMs: toNumber(process.env.API_RATE_LIMIT_WINDOW_MS, 60000),
    apiRateLimitMax: toNumber(process.env.API_RATE_LIMIT_MAX, 120),
    commentTtlDays: toNumber(process.env.COMMENT_TTL_DAYS, 30),
    trustProxy: toBoolean(process.env.TRUST_PROXY, false),
  }
}

export const validateEnv = () => {
  const env = getEnv()
  const missing = []

  if (!env.databaseUrl) missing.push('DATABASE_URL')
  if (!env.accessTokenSecret) missing.push('ACCESS_TOKEN_SECRET')
  if (!env.refreshTokenSecret) missing.push('REFRESH_TOKEN_SECRET')

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    )
  }
}
