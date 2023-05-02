import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  addPlayerToDB,
  getAllPlayersFromDB,
  getPlayerFromDB,
} from "~/server/db/playerUtils";
import PlayerSchema from "~/server/db/PlayerSchema";

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
      const player = addPlayerToDB(input.email, input);
      return player;
    }),
});
