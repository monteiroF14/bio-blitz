// import { addQuestToDB } from "./../../db/questUtils";
// import { generateQuests } from "./../../utils/quest/generateQuests";
// import * as functions from "firebase-functions";
// import { addBattlePassToDB } from "../../db/battlePassUtils";
// import { BattlePass } from "../../utils/BattlePass";

// //TODO: change cloudFunctions name to src because ye
// //TODO: make sure compiler doesn't compile some random .ts
const DAILY_QUESTS_COUNT = 4;
const WEEKLY_QUESTS_COUNT = 6;
const MONTHLY_QUESTS_COUNT = 3;
const BP_LEVEL_XP = 5000;
export const MAX_BP_LEVEL = 30;

// export const questDailySchedule = functions.https.onRequest(
//   async (req, res) => {
//     const generatedQuests = generateQuests(DAILY_QUESTS_COUNT, "daily");
//     const addQuestPromises = generatedQuests.map((quest) =>
//       addQuestToDB(quest.questId, quest)
//     );
//     await Promise.all(addQuestPromises);
//     res.send("New daily quest created!");
//   }
// );

// export const questWeeklySchedule = functions.https.onRequest(
//   async (req, res) => {
//     const generatedQuests = generateQuests(WEEKLY_QUESTS_COUNT, "weekly");
//     const addQuestPromises = generatedQuests.map((quest) =>
//       addQuestToDB(quest.questId, quest)
//     );
//     await Promise.all(addQuestPromises);
//     res.send("New weekly quest created!");
//   }
// );

// export const questMonthlySchedule = functions.https.onRequest(
//   async (req, res) => {
//     const generatedQuests = generateQuests(MONTHLY_QUESTS_COUNT, "monthly");
//     const addQuestPromises = generatedQuests.map((quest) =>
//       addQuestToDB(quest.questId, quest)
//     );
//     await Promise.all(addQuestPromises);
//     res.send("New monthly quest created!");
//   }
// );

// export const battlePassSchedule = functions.https.onRequest(
//   async (req, res) => {
//     await addBattlePassToDB(new BattlePass(BP_LEVEL_XP, MAX_BP_LEVEL));
//     res.send("New Battle Pass created!");
//   }
// );
