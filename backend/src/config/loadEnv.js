import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let envLoaded = false

export const loadEnv = () => {
  if (envLoaded) {
    return
  }

  dotenv.config({ path: path.resolve(__dirname, '../../../.env'), quiet: true })
  dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true, quiet: true })

  envLoaded = true
}
