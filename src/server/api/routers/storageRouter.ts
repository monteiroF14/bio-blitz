import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAssetsFromStorage } from "~/server/db/storage";

export const storageRouter = createTRPCRouter({
  getAssetsFromStorage: publicProcedure.query(async () => {
    const assets = await getAssetsFromStorage();
    return assets;
  }),
});
