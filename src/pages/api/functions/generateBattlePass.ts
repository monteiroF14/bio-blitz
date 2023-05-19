import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
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
    const tokenFromRequest = request.headers.authorization;

    if (tokenFromRequest !== env.CRON_TOKEN) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

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
