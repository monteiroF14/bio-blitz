import { NextApiRequest, NextApiResponse } from "next";
import { getAllPlayersFromDB } from "~/server/db/playerUtils";
import {
  addQuestToDB,
  deleteQuestFromDB,
  getAllQuestsByType,
} from "~/server/db/questUtils";
import { generateQuests } from "~/server/utils/quest/generateQuests";
import { QuestWithPlayer } from "./generateDailyQuests";
import { hashEmail } from "~/components/Header";

const WEEKLY_QUESTS_COUNT = 6;
const QUEST_TYPE: QuestWithPlayer["type"] = "weekly";

async function generateWeeklyQuests(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    await getAllQuestsByType(QUEST_TYPE).then((allWeeklyQuests) => {
      const deleteQuestsPromises = allWeeklyQuests.map((quest) =>
        deleteQuestFromDB(quest.questId)
      );

      return Promise.all(deleteQuestsPromises);
    });

    const allPlayers = await getAllPlayersFromDB();

    const generatedQuests: QuestWithPlayer[] = allPlayers.flatMap((player) =>
      generateQuests(WEEKLY_QUESTS_COUNT, QUEST_TYPE).map((quest) => ({
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
        message: "New weekly quest created!",
      });
    });
  } catch (error) {
    console.error("Error occurred:", error);
    response.status(500).json({ error: "An internal server error occurred." });
  }
}

export default generateWeeklyQuests;
