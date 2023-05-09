import {
  ItemSchema,
  addItemToDB,
  getAllItemsFromCollection,
  getAllItemsFromDB,
  getItemByType,
} from "~/server/db/itemUtils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const itemRouter = createTRPCRouter({
  addItemToDB: publicProcedure.input(ItemSchema).mutation(async ({ input }) => {
    try {
      await addItemToDB(input);
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
  getItemByType: publicProcedure.input(z.string()).query(({ input }) => {
    try {
      return getItemByType(input);
    } catch (err) {
      console.error(err);
    }
  }),
  getAllItemsFromDB: publicProcedure.query(async () => {
    try {
      return await getAllItemsFromDB();
    } catch (err) {
      console.error(err);
    }
  }),
});
