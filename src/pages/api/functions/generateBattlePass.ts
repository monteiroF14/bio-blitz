import { NextApiRequest, NextApiResponse } from "next";
import {
  addBattlePassToDB,
  getBattlePassFromDB,
} from "~/server/db/battlePassUtils";
import { getAllItemsFromDB } from "~/server/db/itemUtils";
import { BattlePass } from "~/server/utils/BattlePass";

const BP_LEVEL_XP = 5000;
export const MAX_BP_LEVEL = 30;

async function generateBattlePass(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const [battlePass, allItemsFromDB] = await Promise.all([
      getBattlePassFromDB(),
      getAllItemsFromDB(),
    ]);

    const itemsNotInReward = allItemsFromDB
      ? allItemsFromDB.filter(
          (item) =>
            !battlePass?.tiers.flatMap((tier) => tier.reward).includes(item)
        )
      : [];

    await addBattlePassToDB(
      new BattlePass(BP_LEVEL_XP, MAX_BP_LEVEL, itemsNotInReward)
    ).then((newlyCreatedBattlePass) => {
      response.status(200).json({
        body: newlyCreatedBattlePass,
        query: request.query,
        cookies: request.cookies,
        message: "New daily quest created!",
      });
    });
  } catch (error) {
    console.error("Error occurred:", error);
    response.status(500).json({ error: "An internal server error occurred." });
  }
}

export default generateBattlePass;
