import { NextApiRequest, NextApiResponse } from "next";
import { addQuestToDB } from "~/server/db/questUtils";
import { generateQuests } from "~/server/utils/quest/generateQuests";

const WEEKLY_QUESTS_COUNT = 6;

export default async function generateWeeklyQuests(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const generatedQuests = generateQuests(WEEKLY_QUESTS_COUNT, "weekly");
    const addQuestPromises = generatedQuests.map((quest) =>
      addQuestToDB(quest.questId, quest)
    );

    await Promise.all(addQuestPromises).then(() => {
      response.status(200).json({
        body: generatedQuests,
        query: request.query,
        cookies: request.cookies,
        message: "New weekly quest created!",
      });
    });
  } catch (error) {
    console.error("Error occurred:", error);
    response.status(500).json({ error: "An internal server error occurred." });
  }
}
