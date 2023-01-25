import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../src/server/router/router";
import { createContext } from "../../../src/utils/context";
// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
