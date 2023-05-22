import { NextApiRequest, NextApiResponse } from "next";
import { addQuestToDB } from "~/server/db/questUtils";
import { generateQuests } from "~/server/utils/quest/generateQuests";

const MONTHLY_QUESTS_COUNT = 3;

async function generateMonthlyQuests(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const generatedQuests = generateQuests(MONTHLY_QUESTS_COUNT, "monthly");
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

export default generateMonthlyQuests;
