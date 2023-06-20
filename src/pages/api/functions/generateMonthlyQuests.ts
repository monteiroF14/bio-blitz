import { NextApiRequest, NextApiResponse } from "next";
import {
  addQuestToDB,
  deleteQuestFromDB,
  getAllQuestsByType,
} from "~/server/db/questUtils";
import { generateQuests } from "~/server/utils/quest/generateQuests";
import { QuestWithPlayer } from "./generateDailyQuests";
import { getAllPlayersFromDB } from "~/server/db/playerUtils";
import { hashEmail } from "~/components/ui/Header";

const MONTHLY_QUESTS_COUNT = 3;
const QUEST_TYPE: QuestWithPlayer["type"] = "monthly";

async function generateMonthlyQuests(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    await getAllQuestsByType(QUEST_TYPE).then((allMonthlyQuests) => {
      const deleteQuestsPromises = allMonthlyQuests.map((quest) =>
        deleteQuestFromDB(quest.questId)
      );

      return Promise.all(deleteQuestsPromises);
    });

    const allPlayers = await getAllPlayersFromDB();

    const generatedQuests: QuestWithPlayer[] = allPlayers.flatMap((player) =>
      generateQuests(MONTHLY_QUESTS_COUNT, QUEST_TYPE).map((quest) => ({
        playerId: hashEmail(player.email),
        ...quest,
      }))
    );

    const addQuestPromises = generatedQuests.map((quest) =>
      addQuestToDB(quest.questId, quest)
    );

    await Promise.all(addQuestPromises).then(() => {
      response.status(200).json({
        body: generatedQuests,
        query: request.query,
        cookies: request.cookies,
        message: "New monthly quest created!",
      });
    });
  } catch (error) {
    console.error("Error occurred:", error);
    response.status(500).json({ error: "An internal server error occurred." });
  }
}

export default generateMonthlyQuests;
