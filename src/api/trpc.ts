import { TRPCError, initTRPC } from '@trpc/server'
import { Context } from './context'
import SuperJSON from 'superjson'
import { Redis } from 'ioredis'
import Store from 'electron-store'
import { config } from 'dotenv'
import {
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  CONNECTION_STRING
} from './utils/constants'
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../db/schema'

config()

const t = initTRPC
  .context<Context>()
  .create({ isServer: true, transformer: SuperJSON })
export const middleware = t.middleware

export const Storage = new Store()
export const redis = new Redis({
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT || ''),
  password: REDIS_PASSWORD
})

export const client = postgres(CONNECTION_STRING, { max: 1 })
export const db = drizzle(client, { schema })

export const isAuthed = middleware(async ({ ctx: { req }, next }) => {
  if (!req?.session || !req?.session?.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: { req }
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = publicProcedure.use(isAuthed)
