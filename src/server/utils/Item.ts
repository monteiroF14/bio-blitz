import { ItemSchema } from "../db/collectionUtils";
import { z } from "zod";

export type Item = z.infer<typeof ItemSchema>;
