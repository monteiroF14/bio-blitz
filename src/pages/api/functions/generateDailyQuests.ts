import { NextApiRequest, NextApiResponse } from "next";
import { hashEmail } from "~/components/Header";
import { getAllPlayersFromDB } from "~/server/db/playerUtils";
import {
  addQuestToDB,
  deleteQuestFromDB,
  getAllQuestsByType,
} from "~/server/db/questUtils";
import { Quest, generateQuests } from "~/server/utils/quest/generateQuests";

const DAILY_QUESTS_COUNT = 4;
const QUEST_TYPE: QuestWithPlayer["type"] = "daily";

export interface QuestWithPlayer extends Quest {
  playerId: string;
}

async function generateDailyQuests(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    await getAllQuestsByType(QUEST_TYPE).then((allDailyQuests) => {
      const deleteQuestsPromises = allDailyQuests.map(({ questId }) =>
        deleteQuestFromDB(questId)
      );

      return Promise.all(deleteQuestsPromises);
    });

    const allPlayers = await getAllPlayersFromDB();

    const generatedQuests: QuestWithPlayer[] = allPlayers.flatMap((player) =>
      generateQuests(DAILY_QUESTS_COUNT, QUEST_TYPE).map((quest) => ({
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
        message: "New daily quest created!",
      });
    });
  } catch (error) {
    console.error("Error occurred:", error);
    response.status(500).json({ error: "An internal server error occurred." });
  }
}

export default generateDailyQuests;
