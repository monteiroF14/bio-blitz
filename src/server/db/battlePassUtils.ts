import { z } from "zod";
import { db } from "./firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { MAX_BP_LEVEL } from "../functions/cloudFunctions";
import { BattlePass } from "../utils/BattlePass";

export const BattlePassSchema = z.object({
  tiers: z
    .object({
      tier: z.number().min(1).max(MAX_BP_LEVEL),
      requiredXP: z.number().nonnegative(),
    })
    .array(),
  expiringAt: z.union([z.date(), z.string()]),
});

export const addBattlePassToDB = async (battlePass: BattlePass) => {
  try {
    const { tiers, expiringAt } = BattlePassSchema.parse(battlePass);
    const formattedBattlePass = {
      tiers,
      expiringAt:
        expiringAt instanceof Date ? expiringAt.toISOString() : expiringAt,
    };
    await addDoc(collection(db, "battlePass"), formattedBattlePass);
    console.log("Battle Pass added to database!");
  } catch (error) {
    console.error("Error adding battle pass to database: ", error);
    throw error;
  }
};

export const getBattlePassFromDB = async (): Promise<BattlePass> => {
  try {
    const collectionRef = collection(db, "battlePass");
    const querySnapshot = await getDocs(collectionRef);
    let latestData: BattlePass | undefined;
    querySnapshot.forEach((doc) => {
      latestData = doc.data() as BattlePass;
    });
    if (latestData !== undefined) {
      return latestData;
    }
    throw new Error("No data found in the 'battlePass' collection");
  } catch (error) {
    console.error("Error getting battle pass from database: ", error);
    throw error;
  }
};

//TODO: write expiring date script to decrement
