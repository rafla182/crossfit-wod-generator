import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  wod: router({
    generate: protectedProcedure
      .input(
        z.object({
          strategy: z.enum(["AMRAP", "EMOM", "For Time", "Strength", "Hybrid"]),
          duration: z.number().min(5).max(120),
          difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
          movements: z.array(z.string()).optional(),
          equipment: z.array(z.string()).optional(),
          focusArea: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { generateWOD } = await import("./wod.generator");
        const wod = await generateWOD(input);
        return wod;
      }),

    save: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          strategy: z.string(),
          duration: z.number(),
          difficulty: z.string(),
          warmup: z.string(),
          mainWorkout: z.string(),
          cooldown: z.string(),
          movements: z.string(),
          equipment: z.string(),
          notes: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createWOD } = await import("./wod.db");
        const wod = await createWOD({
          userId: ctx.user.id,
          ...input,
        });
        return wod;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserWODs } = await import("./wod.db");
      const wods = await getUserWODs(ctx.user.id);
      return wods;
    }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteWOD } = await import("./wod.db");
        const success = await deleteWOD(input.id);
        return { success };
      }),
  }),
});

export type AppRouter = typeof appRouter;
