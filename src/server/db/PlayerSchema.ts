import { z } from "zod";
import { ItemSchema } from "./itemUtils";

export const FeedbackSchema = z.object({
  description: z.string(),
  rating: z.number(),
  creationDate: z.date(),
});

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
    activeTitle: z.string(),
    titles: z.array(z.string()),
  }),
  rewards: z.array(ItemSchema),
  feedbacks: z.array(FeedbackSchema),
});

export default PlayerSchema;
