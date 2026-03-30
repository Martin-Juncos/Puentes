import { AppError } from './AppError.js'

export const ensureFound = (record, code, message, details = undefined) => {
  if (!record) {
    throw new AppError(404, code, message, details)
  }

  return record
}

export const buildNotFoundError = (code, message, details = undefined) =>
  new AppError(404, code, message, details)
