import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  addQuestProofToStorage,
  getAssetsFromStorage,
} from "~/server/db/storage";
import z from "zod";

export const storageRouter = createTRPCRouter({
  getAssetsFromStorage: publicProcedure.query(async () => {
    const assets = await getAssetsFromStorage();
    return assets;
  }),
  addQuestProofToStorage: publicProcedure
    .input(
      z.object({
        playerId: z.string(),
        questId: z.string(),
        proof: z.string(),
      })
    )
    .mutation(async ({ input: { playerId, questId, proof } }) => {
      return await addQuestProofToStorage(playerId, questId, proof);
    }),
});
