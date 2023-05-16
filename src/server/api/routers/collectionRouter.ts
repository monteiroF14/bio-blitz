import {
  CollectionSchema,
  addCollectionToDB,
  getCollectionByName,
} from "~/server/db/collectionUtils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const collectionRouter = createTRPCRouter({
  addCollectionToDB: publicProcedure
    .input(CollectionSchema)
    .mutation(async ({ input }) => {
      try {
        await addCollectionToDB(input);
      } catch (err) {
        console.error(err);
      }
    }),
  getCollectionByName: publicProcedure.input(z.string()).query(({ input }) => {
    try {
      return getCollectionByName(input);
    } catch (err) {
      console.error(err);
    }
  }),
});
