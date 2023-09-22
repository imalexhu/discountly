import { userRouter } from "~/server/api/routers/user";
import { websiteRouter } from "~/server/api/routers/website";
import { productRouter } from "~/server/api/routers/product";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  website: websiteRouter,
  product: productRouter,
});


// export type definition of API
export type AppRouter = typeof appRouter;
