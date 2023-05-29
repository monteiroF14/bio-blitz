import {
  BattlePassSchema,
  addBattlePassToDB,
} from "./../../db/battlePassUtils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getBattlePassFromDB } from "~/server/db/battlePassUtils";

export const battlePassRouter = createTRPCRouter({
  getBattlePassFromDB: publicProcedure.query(() => {
    return getBattlePassFromDB();
  }),
  addBattlePassToDB: publicProcedure
    .input(BattlePassSchema)
    .mutation(async ({ input }) => {
      await addBattlePassToDB(input);
    }),
});
