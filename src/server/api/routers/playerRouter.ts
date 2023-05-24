import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  addPlayerToDB,
  getAllPlayersFromDB,
  getPlayerFromDB,
  getSchoolsByLocation,
  increaseXP,
  updatePlayerFeedback,
  updatePlayerSchoolAndLocation,
  updatePlayerTitle,
  updatePlayerWallet,
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
    .input(
      z.object({
        uid: z.string(),
        player: PlayerSchema,
      })
    )
    .mutation(async ({ input }) => {
      const player = await addPlayerToDB(input.uid, input.player);
      return player;
    }),
  updatePlayerSchoolAndLocation: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        location: z.string(),
        school: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await updatePlayerSchoolAndLocation(
        input.uid,
        input.location,
        input.school
      );
    }),
  updatePlayerTitle: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await updatePlayerTitle(input.uid, input.title);
    }),
  updatePlayerFeedback: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        feedback: FeedbackSchema,
      })
    )
    .mutation(async ({ input }) => {
      await updatePlayerFeedback(input.uid, input.feedback);
    }),
  updatePlayerWallet: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await updatePlayerWallet(input.uid, input.amount);
      console.log(`Updated wallet in ${input.amount}€`);
    }),
  increasePlayerXP: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        XP: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await increaseXP(input.uid, input.XP);
      console.log(`Increased ${input.XP} XP`);
    }),
  getSchoolsByLocation: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const schools = await getSchoolsByLocation(input);
      console.log("schools: ", schools);
    }),
});
