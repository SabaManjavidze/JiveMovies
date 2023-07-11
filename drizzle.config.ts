import type { Config } from 'drizzle-kit'
import { CONNECTION_STRING } from './src/api/utils/constants'

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    connectionString: CONNECTION_STRING
  },
  driver: 'pg'
} satisfies Config
