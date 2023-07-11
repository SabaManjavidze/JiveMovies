import { z } from 'zod'
import {
  publicProcedure,
  protectedProcedure,
  router,
  Storage,
  redis,
  db
} from '../trpc'
import pbkdf2 from 'pbkdf2-passworder'
import { registerSchemaForm } from '../utils/types/zodTypes'
import { COOKIE_NAME } from '../utils/constants'
import { TRPCError } from '@trpc/server'
import { zodEmail, zodPassword } from '../utils/types/zodTypes'
import { nanoid } from 'nanoid'
import { NewUser, UserType, users } from '../../db/schema'

const createSession = async (userId: string) => {
  const sessionId = nanoid()
  Storage.set(COOKIE_NAME, sessionId)
  await redis.set(sessionId, JSON.stringify({ userId }))
}

const UserFragment = {
  id: true,
  username: true,
  picture: true
}

export const userRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: zodEmail,
        password: zodPassword
      })
    )
    .mutation(async ({ input: { email, password } }) => {
      let user: UserType
      try {
        const result = await db.query.users.findFirst({
          where: (user, { eq }) => eq(user.email, email)
        })
        if (result == null) {
          return {
            errors: [
              {
                field: 'email',
                message: 'email not found'
              }
            ]
          }
        }
        if (!result?.password) {
          //return error indicating that user is setting the password
          //then handle it on the client by redirecting
          // 1. verifying the email
          // 2. double entering password (default input and re-type input)
          return {
            errors: [
              {
                field: 'password',
                message: 'verify your email to set the password'
              }
            ]
          }
        }

        const passwordMatch = await pbkdf2.compare(result.password, password)
        if (!passwordMatch) {
          return {
            errors: [
              {
                field: 'password',
                message: 'password does not match'
              }
            ]
          }
        }
        user = result
      } catch (err: any) {
        console.log({ errorISREAL: err })
      }
      if (!user)
        return { errors: [{ field: 'email', message: 'email not found' }] }
      createSession(user.id)

      return { user }
    }),
  register: publicProcedure
    .input(registerSchemaForm)
    .mutation(
      async ({ input: { email, username, birthDate, gender, password } }) => {
        try {
          const hashedPassword = await pbkdf2.hash(password)
          const userId = nanoid()
          const newUser: NewUser = {
            id: userId,
            email,
            username,
            birthDate: birthDate.toLocaleDateString(),
            gender,
            password: hashedPassword
          }

          await db.insert(users).values(newUser)

          await createSession(userId)
          return newUser
        } catch (err: any) {
          if (err.code === '23505') {
            throw new TRPCError({
              message: 'username is already taken',
              code: 'CONFLICT'
            })
          } else {
            throw new TRPCError({
              message: JSON.stringify(err),
              code: 'BAD_REQUEST'
            })
          }
        }
      }
    ),
  me: protectedProcedure.query(async ({ ctx: { req } }) => {
    const userProfile = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, req.session.userId),
      columns: UserFragment
    })
    return userProfile
  }),
  logout: protectedProcedure.mutation(async ({ ctx: { req } }) => {
    const sessionId = Storage.get(COOKIE_NAME) as string
    await redis.del(sessionId)
    req.session = null
    Storage.clear()
  })
})
