const sanitizeString = (value) => {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
}

const sanitizeValue = (value) => {
  if (typeof value === 'string') return sanitizeString(value)
  if (Array.isArray(value)) return value.map(sanitizeValue)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [
        key,
        sanitizeValue(entryValue),
      ]),
    )
  }
  return value
}
const overwriteObjectInPlace = (target, source) => {
  if (!target || typeof target !== 'object') return
  for (const key of Object.keys(target)) delete target[key]
  Object.assign(target, source)
}

const shouldPreserveRawPostContent = (req) => {
  if (!['POST', 'PATCH'].includes(req.method)) return false
  const path = req.originalUrl.split('?')[0]
  return /^\/api\/admin\/posts?(?:\/[0-9a-fA-F]{24})?$/.test(path)
}

export const sanitizeInput = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    const preserveContent =
      shouldPreserveRawPostContent(req) &&
      Object.prototype.hasOwnProperty.call(req.body, 'content')
    const rawContent = preserveContent ? req.body.content : null

    req.body = sanitizeValue(req.body)
    if (preserveContent) {
      req.body.content = rawContent
    }
  }
  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery = sanitizeValue(req.query)
    overwriteObjectInPlace(req.query, sanitizedQuery)
  }
  next()
}
