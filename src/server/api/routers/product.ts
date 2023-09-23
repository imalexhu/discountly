import { currentUser, clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  userClick: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {

      const clerkUser = ctx.authenticatedUser
      const clicks: string = clerkUser.privateMetadata.clicks as string;
      const updatedClicks = clicks ? parseInt(clicks) + 1 : 1

      // increment click or initalise it
      await clerkClient.users.updateUser(clerkUser.id, {
        unsafeMetadata: {
          clicks: updatedClicks.toString()
        }
      })


      const product = ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          clicks: { increment: 1 }
        }
      })
    }),
});
