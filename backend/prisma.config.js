import { defineConfig } from 'prisma/config'

import { loadEnv } from './src/config/loadEnv.js'

loadEnv()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'node prisma/seed.js',
  },
})
