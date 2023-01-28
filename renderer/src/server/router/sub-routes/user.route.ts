import { z } from "zod";
import { UserFragment } from "../../../utils/prisma";
import {
  registerSchema,
  zodEmail,
  zodPassword,
} from "../../lib/zod/UserSchemas";
import { isAuthed } from "../middlewares/isAuthed";
import { procedure, router } from "../trpc";
import argon2 from "argon2";

export const userRouter = router({
  login: procedure
    .input(
      z.object({
        email: zodEmail,
        password: zodPassword,
      })
    )
    .mutation(async ({ input: { email, password }, ctx: { req } }) => {
      let user;
      try {
        const result = await prisma.user.findFirst({
          where: { email },
        });
        if (result == null) {
          return {
            errors: [
              {
                field: "email",
                message: "email not found",
              },
            ],
          };
        }
        if (!result?.password) {
          //return error indicating that user is setting the password
          //then handle it on the client by redirecting
          // 1. verifying the email
          // 2. double entering password (default input and re-type input)
          return {
            errors: [
              {
                field: "password",
                message: "verify your email to set the password",
              },
            ],
          };
        }

        const passwordMatch = await argon2.verify(result.password, password);
        if (!passwordMatch) {
          return {
            errors: [
              {
                field: "password",
                message: "password does not match",
              },
            ],
          };
        }
        user = result;
      } catch (err: any) {
        console.log({ errorISREAL: err });
      }
      if (!user)
        return { errors: [{ field: "email", message: "email not found" }] };
      req.session.userId = user.user_id;

      return { user };
    }),
  register: procedure
    .input(registerSchema)
    .mutation(
      async ({
        input: { email, username, age, gender, password },
        ctx: { req },
      }) => {
        let user;
        try {
          const hashedPassword = await argon2.hash(password);
          const result = await prisma.user.create({
            data: {
              email,
              username,
              age,
              gender,
              password: hashedPassword,
            },
          });
          user = result;
        } catch (err: any) {
          if (err.code === "23505") {
            return {
              errors: [
                {
                  field: "username",
                  message: "username already taken",
                },
              ],
            };
          }
          console.log({ error: err.message });
        }
        if (!user)
          return {
            errors: [{ field: "general", message: "something went wrong" }],
          };
        req.session.userId = user.user_id;

        return { user };
      }
    ),
  logout: procedure.use(isAuthed).mutation(({ ctx: { req } }) => {
    req.session.destroy();
    return true;
  }),
  me: procedure.use(isAuthed).query(async ({ ctx: { req } }) => {
    const user = await prisma.user.findFirst({
      where: { user_id: req.session.userId },
      select: { ...UserFragment, email_verified: true },
    });
    return user;
  }),
});
