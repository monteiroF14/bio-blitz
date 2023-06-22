import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  addQuestToDB,
  getAllQuestsByType,
  getAllQuestsByTypeFromPlayer,
  increaseQuestFrequency,
} from "~/server/db/questUtils";
import QuestSchema from "~/server/db/QuestSchema";

const questTypeSchema = z.union([
  z.literal("daily"),
  z.literal("weekly"),
  z.literal("monthly"),
]);

export const questRouter = createTRPCRouter({
  getAllQuestByType: publicProcedure
    .input(
      z.object({
        type: questTypeSchema,
      })
    )
    .query(async ({ input }) => {
      const quests = await getAllQuestsByType(input.type);
      return quests;
    }),
  addQuest: publicProcedure.input(QuestSchema).mutation(async ({ input }) => {
    const addedQuest = await addQuestToDB(input.questId, input);
    return addedQuest;
  }),
  getAllQuestsByTypeFromPlayer: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        type: questTypeSchema,
      })
    )
    .query(async ({ input: { uid, type } }) => {
      return await getAllQuestsByTypeFromPlayer(uid, type);
    }),
  increaseQuestFrequency: publicProcedure
    .input(z.object({ questId: z.string() }))
    .mutation(async ({ input: { questId } }) => {
      return await increaseQuestFrequency(questId);
    }),
});
