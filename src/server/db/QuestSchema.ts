import { z } from "zod";

export const QuestSchema = z.object({
  questId: z.string(),
  description: z.string(),
  type: z.union([
    z.literal("daily"),
    z.literal("weekly"),
    z.literal("monthly"),
  ]),
  XP: z.number(),
  expiringDate: z.date(),
  frequency: z.number(),
  currentFrequency: z.number(),
  status: z.union([
    z.literal("completed"),
    z.literal("in-progress"),
    z.literal("not-started"),
  ]),
});

export default QuestSchema;
