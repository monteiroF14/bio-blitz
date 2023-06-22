import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  addPlayerToDB,
  getAllPlayersFromDB,
  getPlayerFromDB,
  fetchSchools,
  increaseXP,
  updatePlayerTitle,
  updatePlayerWallet,
  updatePlayerSchool,
  updatePlayerPreferences,
} from "~/server/db/playerUtils";
import PlayerSchema from "~/server/db/PlayerSchema";
import { ItemSchema } from "~/server/db/collectionUtils";
import QRCode from "qrcode";
import { addWalletReceiptToStorage } from "~/server/db/storage";

export const playerRouter = createTRPCRouter({
  getAllPlayersFromDB: publicProcedure.query(async () => {
    const players = await getAllPlayersFromDB();
    return players;
  }),
  getPlayerFromDB: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await getPlayerFromDB(input);
    }),
  addPlayerToDB: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        player: PlayerSchema,
      })
    )
    .mutation(async ({ input: { uid, player } }) => {
      const newlyPlayer = await addPlayerToDB(uid, player);
      return newlyPlayer;
    }),
  updatePlayerSchool: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        school: z.string(),
      })
    )
    .mutation(async ({ input: { uid, school } }) => {
      await updatePlayerSchool(uid, school);
    }),
  updatePlayerTitle: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await updatePlayerTitle(input.uid, input.title);
    }),
  updatePlayerPreferences: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        preferences: z.object({
          // type it so Item with specific type is allowed
          activeBackground: ItemSchema.nullable().optional(),
          activeAvatarBorder: ItemSchema.nullable().optional(),
        }),
      })
    )
    .mutation(async ({ input: { uid, preferences } }) => {
      await updatePlayerPreferences(uid, preferences);
    }),
  updatePlayerWallet: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input: { uid, amount } }) => {
      await updatePlayerWallet(uid, amount);

      const receiptQrCode = await QRCode.toDataURL(`${amount}€ voucher!`);
      const receiptURL = await addWalletReceiptToStorage(uid, receiptQrCode);
      console.log("receiptURL: ", receiptURL);
      return receiptURL;
    }),
  increasePlayerXP: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        XP: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await increaseXP(input.uid, input.XP);
      console.log(`Increased ${input.XP} XP`);
    }),
  fetchSchools: publicProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .query(async ({ input: { url } }) => {
      const schools = await fetchSchools(url);
      return schools;
    }),
});
