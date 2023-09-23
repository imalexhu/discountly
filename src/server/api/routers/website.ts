import { z } from "zod";

import { createTRPCRouter, publicProcedure, } from "~/server/api/trpc";

export const websiteRouter = createTRPCRouter({
  searchWebsite: publicProcedure
    .input(z.object({ websiteUrl: z.string() }))
    .query(async ({ ctx, input }) => {
      const rootUrl = input.websiteUrl.split("?")[0]!;
      const website = await ctx.prisma.website.findUnique({
        where: {
          websiteName: rootUrl,
        },
        include: {
          products: true
        }
      })
      
      if (!website) {
        await ctx.prisma.website.create({
          data: {
            websiteName: rootUrl,
            searched: 0,
          }
        })
      }

      return website
    }),
});
