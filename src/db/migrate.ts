import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import { CONNECTION_STRING } from '../api/utils/constants'

const client = postgres(CONNECTION_STRING, { max: 1 })
const db: PostgresJsDatabase = drizzle(client)
const main = async () => {
  await migrate(db, { migrationsFolder: 'drizzle' })
}
main()
