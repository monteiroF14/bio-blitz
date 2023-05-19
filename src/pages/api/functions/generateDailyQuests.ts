import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { addQuestToDB } from "~/server/db/questUtils";
import { generateQuests } from "~/server/utils/quest/generateQuests";

const DAILY_QUESTS_COUNT = 4;

async function generateDailyQuests(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const tokenFromRequest = request.headers.authorization;

    if (tokenFromRequest !== env.CRON_TOKEN) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const generatedQuests = generateQuests(DAILY_QUESTS_COUNT, "daily");
    const addQuestPromises = generatedQuests.map((quest) =>
      addQuestToDB(quest.questId, quest)
    );

    await Promise.all(addQuestPromises).then(() => {
      response.status(200).json({
        body: generatedQuests,
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

export default generateDailyQuests;
