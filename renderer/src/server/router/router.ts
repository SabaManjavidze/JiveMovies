import { z } from "zod";
import { procedure, router } from "./trpc";
import { userRouter } from "./sub-routes/user.route";
import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { inferReactQueryProcedureOptions } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { isAuthed } from "./middlewares/isAuthed";
import { movieRouter } from "./sub-routes/movie.route";

config();

export const appRouter = router({
  user: userRouter,
  movie: movieRouter,
  deleteImage: procedure
    .use(isAuthed)
    .input(z.object({ imageId: z.string() }))
    .mutation(async ({ input: { imageId } }) => {
      // delete image by id
      await cloudinary.uploader.destroy(imageId, {
        invalidate: true,
      });
    }),
  uploadImage: procedure
    .use(isAuthed)
    .input(z.object({ picture: z.string() }))
    .mutation(async ({ input }) => {
      const result = await cloudinary.uploader.upload(input.picture);
      if (!result) return;
      return result;
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
