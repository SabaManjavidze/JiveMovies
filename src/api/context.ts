import { inferAsyncReturnType } from '@trpc/server'
import { Storage, redis } from './trpc'
import { CreateContextOptions } from 'electron-trpc/main'
import { COOKIE_NAME } from './utils/constants'

export const createContext = async ({ event }: CreateContextOptions) => {
  const jiveId = Storage.get(COOKIE_NAME) as string
  let session: null | { userId: string } = null
  if (jiveId) {
    const userSession = await redis.get(jiveId)
    if (userSession) {
      const parsedSession = JSON.parse(userSession)
      if (parsedSession?.userId) {
        session = parsedSession
      }
    }
  }
  return {
    req: { session },
    event
  }
}
export type Context = inferAsyncReturnType<typeof createContext>
