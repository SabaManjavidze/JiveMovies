import { z } from "zod";
import { procedure, router } from "../trpc";

export const userRouter = router({
  facebookLogin: procedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ input: { code }, ctx: { req } }) => {
      if (!code) return false;
    }),
});
