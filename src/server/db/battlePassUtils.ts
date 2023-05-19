import { z } from "zod";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { MAX_BP_LEVEL } from "../functions/cloudFunctions";
import { BattlePass } from "../utils/BattlePass";
import { ItemSchema } from "./itemUtils";

export const BattlePassSchema = z.object({
  tiers: z.array(
    z.object({
      tier: z.number().min(1).max(MAX_BP_LEVEL),
      requiredXP: z.number().nonnegative(),
      reward: ItemSchema,
    })
  ),
  expiringAt: z.union([z.date(), z.string()]),
});

export const addBattlePassToDB = async (battlePass = {}) => {
  try {
    const { tiers, expiringAt } = BattlePassSchema.parse(battlePass);
    const formattedBattlePass = {
      tiers,
      expiringAt:
        expiringAt instanceof Date ? expiringAt.toISOString() : expiringAt,
    };
    await addDoc(
      collection(db, "battlePass"),
      formattedBattlePass as BattlePass
    );
    console.log("Battle Pass added to database!");
    return formattedBattlePass;
  } catch (error) {
    console.error("Error adding battle pass to database: ", error);
    throw error;
  }
};

export const getBattlePassFromDB = async () => {
  try {
    const battlePassCollection = collection(db, "battlePass");
    const battlePass = await getDocs(
      query(battlePassCollection, orderBy("expiringAt", "desc"), limit(1))
    );
    if (!battlePass.empty) return battlePass.docs[0]?.data() as BattlePass;
    throw new Error("No data found in the 'battlePass' collection");
  } catch (error) {
    console.error("Error getting battle pass from database: ", error);
    throw error;
  }
};
