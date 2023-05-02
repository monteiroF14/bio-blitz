import { z } from "zod";
import QuestSchema from "./QuestSchema";

const PlayerSchema = z.object({
  name: z.string(),
  email: z.string(),
  image: z.string(),
  location: z.string().nullable(),
  school: z.string().nullable(),
  battlePassData: z.object({
    currentXP: z.number(),
    currentLevel: z.number(),
  }),
  playerData: z.object({
    currentXP: z.number(),
    currentLevel: z.number(),
    questsDone: z.array(QuestSchema),
    title: z.union([
      z.literal("Beginner"),
      z.literal("Intermediate"),
      z.literal("Pro Environmentalist"),
    ]),
  }),
  rewards: z.object({
    battlePassRewards: z.array(z.string()),
    playerLevelingSystemRewards: z.array(z.string()),
  }),
  feedbacks: z.array(
    z.object({
      description: z.string(),
      rating: z.number(),
      creationDate: z.date(),
    })
  ),
});

export default PlayerSchema;
