import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  addPlayerToDB,
  getAllPlayersFromDB,
  getPlayerFromDB,
  increaseXP,
  updatePlayerFeedback,
  updatePlayerSchoolAndLocation,
  updatePlayerTitle,
} from "~/server/db/playerUtils";
import PlayerSchema, { FeedbackSchema } from "~/server/db/PlayerSchema";

export const playerRouter = createTRPCRouter({
  getAllPlayersFromDB: publicProcedure.query(async () => {
    const players = await getAllPlayersFromDB();
    return players;
  }),
  getPlayerFromDB: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const player = await getPlayerFromDB(input);
      return player;
    }),
  addPlayerToDB: publicProcedure
    .input(PlayerSchema)
    .mutation(async ({ input }) => {
      const player = await addPlayerToDB(input.email, input);
      return player;
    }),
  updatePlayerSchoolAndLocation: publicProcedure
    .input(
      z.object({
        email: z.string(),
        location: z.string(),
        school: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await updatePlayerSchoolAndLocation(
        input.email,
        input.location,
        input.school
      );
    }),
  updatePlayerTitle: publicProcedure
    .input(
      z.object({
        email: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await updatePlayerTitle(input.email, input.title);
    }),
  updatePlayerFeedback: publicProcedure
    .input(
      z.object({
        email: z.string(),
        feedback: FeedbackSchema,
      })
    )
    .mutation(async ({ input }) => {
      await updatePlayerFeedback(input.email, input.feedback);
    }),
  increasePlayerXP: publicProcedure
    .input(
      z.object({
        email: z.string(),
        XP: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await increaseXP(input.email, input.XP);
      console.log(`Increased ${input.XP} XP on player ${input.email}`);
    }),
});
