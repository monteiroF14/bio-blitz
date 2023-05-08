import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { addQuestToDB, getAllQuestsByType } from "~/server/db/questUtils";
import QuestSchema from "~/server/db/QuestSchema";

export const questRouter = createTRPCRouter({
  getAllQuestByType: publicProcedure
    .input(
      z.object({
        type: z.union([
          z.literal("daily"),
          z.literal("weekly"),
          z.literal("monthly"),
        ]),
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
});
