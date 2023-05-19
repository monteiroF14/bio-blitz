import { NextApiRequest, NextApiResponse } from "next";
import {
  addBattlePassToDB,
  getBattlePassFromDB,
} from "~/server/db/battlePassUtils";
import { getAllItemsFromDB } from "~/server/db/itemUtils";
import { BattlePass } from "~/server/utils/BattlePass";
import { addQuestToDB } from "~/server/db/questUtils";
import { generateQuests } from "~/server/utils/quest/generateQuests";

export const MAX_BP_LEVEL = 30;
const BP_LEVEL_XP = 5000;
const DAILY_QUESTS_COUNT = 4;
const WEEKLY_QUESTS_COUNT = 6;
const MONTHLY_QUESTS_COUNT = 3;

export default async function cronHandler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const path = request.query.path as string;

    switch (path) {
      case "generateBattlePass":
        await generateBattlePass(request, response);
        break;
      case "generateDailyQuests":
        await generateDailyQuests(request, response);
        break;
      case "generateWeeklyQuests":
        await generateWeeklyQuests(request, response);
        break;
      case "generateMonthlyQuests":
        await generateMonthlyQuests(request, response);
        break;
      default:
        response.status(404).json({ error: "Invalid cron path." });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    response.status(500).json({ error: "An internal server error occurred." });
  }
}

async function generateBattlePass(
  request: NextApiRequest,
  response: NextApiResponse
) {
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

  const newlyCreatedBattlePass = await addBattlePassToDB(
    new BattlePass(BP_LEVEL_XP, MAX_BP_LEVEL, itemsNotInReward)
  );

  response.status(200).json({
    body: newlyCreatedBattlePass,
    query: request.query,
    cookies: request.cookies,
    message: "New battle pass generated!",
  });
}

async function generateDailyQuests(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const generatedQuests = generateQuests(DAILY_QUESTS_COUNT, "daily");
  const addQuestPromises = generatedQuests.map((quest) =>
    addQuestToDB(quest.questId, quest)
  );

  await Promise.all(addQuestPromises);

  response.status(200).json({
    body: generatedQuests,
    query: request.query,
    cookies: request.cookies,
    message: "New daily quests generated!",
  });
}

async function generateWeeklyQuests(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const generatedQuests = generateQuests(WEEKLY_QUESTS_COUNT, "weekly");
  const addQuestPromises = generatedQuests.map((quest) =>
    addQuestToDB(quest.questId, quest)
  );

  await Promise.all(addQuestPromises);

  response.status(200).json({
    body: generatedQuests,
    query: request.query,
    cookies: request.cookies,
    message: "New weekly quests generated!",
  });
}

async function generateMonthlyQuests(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const generatedQuests = generateQuests(MONTHLY_QUESTS_COUNT, "monthly");
  const addQuestPromises = generatedQuests.map((quest) =>
    addQuestToDB(quest.questId, quest)
  );

  await Promise.all(addQuestPromises);

  response.status(200).json({
    body: generatedQuests,
    query: request.query,
    cookies: request.cookies,
    message: "New monthly quests generated!",
  });
}
