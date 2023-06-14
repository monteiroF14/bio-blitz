import {
  CollectionSchema,
  addCollectionToDB,
  addItemToCollection,
  getAllCollectionNamesFromDB,
  getAllItemsFromCollection,
  getCollectionByName,
} from "~/server/db/collectionUtils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { ItemSchema } from "~/server/db/collectionUtils";

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
  addItemToCollection: publicProcedure
    .input(
      z.object({
        name: z.string(),
        item: ItemSchema,
      })
    )
    .mutation(async ({ input: { name, item } }) => {
      try {
        await addItemToCollection(name, item);
      } catch (err) {
        console.error(err);
      }
    }),
  getAllItemsFromCollection: publicProcedure
    .input(z.string())
    .query(({ input }) => {
      try {
        return getAllItemsFromCollection(input);
      } catch (err) {
        console.error(err);
      }
    }),
  getAllCollectionNames: publicProcedure.query(async () => {
    try {
      const collectionNames = await getAllCollectionNamesFromDB();
      return collectionNames;
    } catch (err) {
      console.error(err);
    }
  }),
});
