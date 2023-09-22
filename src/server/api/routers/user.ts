import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { currentUser } from '@clerk/nextjs';
import { TRPCError } from "@trpc/server";


export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .mutation(async ({ ctx }) => {
      const clerkUser = await currentUser();

      if (!clerkUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No authenticated clerk user"
        })
      }
      const user = await ctx.prisma.user.create({
        data:
        {
          id: clerkUser.id,
          username: clerkUser.username,
          fullName: `${clerkUser.firstName} ${clerkUser.lastName}`
        }
      })
      return user
    }), 
    returnData: publicProcedure
      .query(() => {
        return {data :"helloWorld"}
      }),
  userActionClick: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {

      await ctx.prisma.user.update({
        where: {
          id: ctx.authenticatedUser.id
        },
        data: {
          clicks: { increment: 1 }
        }
      })

      await ctx.prisma.product.update({
        where: {
          id: input.productId
        },
        data: {
          clicks: { increment: 1 }
        }
      })
    }),
});
