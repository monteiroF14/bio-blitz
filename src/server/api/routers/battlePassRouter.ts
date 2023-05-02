import {
  BattlePassSchema,
  addBattlePassToDB,
} from "./../../db/battlePassUtils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getBattlePassFromDB } from "~/server/db/battlePassUtils";

export const battlePassRouter = createTRPCRouter({
  getBattlePassFromDB: publicProcedure.query(() => {
    const battlePassData = getBattlePassFromDB();
    return battlePassData;
  }),
  addBattlePassToDB: publicProcedure
    .input(BattlePassSchema)
    .mutation(async ({ input }) => {
      const addedBattlePass = await addBattlePassToDB(input);
      return addedBattlePass;
    }),
});
