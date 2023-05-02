import { z } from "zod";
import BattlePass from "../../utils/BattlePass";
import { db } from "./firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { MAX_BP_LEVEL } from "../functions/cloudFunctions";

export const BattlePassSchema = z.object({
  battlePassId: z.string(),
  tiers: z
    .object({
      tier: z.number().min(1).max(MAX_BP_LEVEL),
      requiredXP: z.number().nonnegative(),
    })
    .array(),
  expiringAt: z.date(),
});

export const addBattlePassToDB = async (battlePass = {}) => {
  await addDoc(collection(db, "battlePass"), battlePass);
};

export const getBattlePassFromDB = () => {
  const collectionRef = collection(db, "battlePass");
  return onSnapshot(collectionRef, (querySnapshot) => {
    let latestData: BattlePass | undefined;
    querySnapshot.forEach((doc) => {
      latestData = doc.data() as BattlePass;
    });
    if (latestData !== undefined) {
      return latestData;
    }
    return undefined;
  });
};
