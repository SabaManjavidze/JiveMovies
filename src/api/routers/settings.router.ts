import { z } from 'zod'
import { Storage, protectedProcedure, redis, router } from '../trpc'
import { COOKIE_NAME } from '../utils/constants'

export const settingsRouter = router({
  getUserSettings: protectedProcedure.query(async ({ ctx: { req } }) => {
    return req.session.settings
  }),
  updateUserSettings: protectedProcedure
    .input(
      z.object({
        lang: z.enum(['ENG', 'GEO', 'RUS'])
      })
    )
    .mutation(async ({ ctx: { req }, input: { lang } }) => {
      if (req.session.settings.lang !== lang) {
        const jiveId = Storage.get(COOKIE_NAME) as string

        const newSession = { ...req.session, settings: { lang } }
        await redis.set(jiveId, JSON.stringify(newSession))
        req.session = newSession
      }
    })
})
