export const sendSuccess = (res, data, meta = undefined, statusCode = 200) => {
  const payload = { data }

  if (meta) {
    payload.meta = meta
  }

  return res.status(statusCode).json(payload)
}
