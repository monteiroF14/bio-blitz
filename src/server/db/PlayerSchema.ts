import { z } from "zod";

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
  rewards: z.array(
    z.object({
      type: z.enum([
        "Theme",
        "Title",
        "Font",
        "AvatarBorder",
        "BackgroundImage",
      ]),
      title: z.string().optional(),
      theme: z
        .object({
          font: z.string(),
          avatarBorder: z.string(),
          backgroundImage: z.string(),
        })
        .optional(),
      font: z.string().optional(),
      avatarBorder: z.string().optional(),
      backgroundImage: z.string().optional(),
    })
  ),
  feedbacks: z.array(
    z.object({
      description: z.string(),
      rating: z.number(),
      creationDate: z.date(),
    })
  ),
});

export default PlayerSchema;
