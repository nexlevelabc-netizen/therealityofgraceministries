import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { sessionFromHeaders } from "./lib/admin-auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
  isAdmin: boolean;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = {
    req: opts.req,
    resHeaders: opts.resHeaders,
    isAdmin: sessionFromHeaders(opts.req.headers),
  };
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // Authentication is optional here
  }
  return ctx;
}
