import { IncomingMessage, ServerResponse } from "http";
import { Session, SessionRecord } from "next-session/lib/types";
import * as trpcNext from "@trpc/server/adapters/next";
import * as trpc from "@trpc/server";
import dotenv from "dotenv";
import nextSession from "next-session";
import { expressSession, promisifyStore } from "next-session/lib/compat";
import RedisStoreFactory from "connect-redis";
import Redis from "ioredis";

dotenv.config();

const RedisStore = RedisStoreFactory(expressSession);
const getSession = nextSession({
  name: process.env.COOKIE_NAME,
  store: promisifyStore(
    new RedisStore({
      client: new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || ""),
        password: process.env.REDIS_PASSWORD,
      }),
    })
  ),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});
type reqType = IncomingMessage & {
  session?: Session<SessionRecord> | undefined;
};
export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions
) => {
  return {
    req: {
      ...opts?.req,
      session: await getSession(
        opts?.req as reqType,
        opts?.res as ServerResponse
      ),
    },
    res: opts?.res,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
