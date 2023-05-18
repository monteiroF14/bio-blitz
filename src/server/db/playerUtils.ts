import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import Player, { Feedback } from "../utils/player/PlayerClass";
import { getBattlePassFromDB } from "./battlePassUtils";
import { BattlePass } from "../utils/BattlePass";
import { Item } from "../utils/Item";
import {
  getAllCollectionNamesFromDB,
  getCollectionByName,
} from "./collectionUtils";

const PLAYER_LEVEL_XP = 5000;

export const getAllPlayersFromDB = async () => {
  try {
    const playersSnapshot = await getDocs(collection(db, "players"));
    return playersSnapshot.docs.map((doc) => doc.data()) as Player[];
  } catch (error) {
    console.error("Error retrieving all players: ", error);
    return [];
  }
};

export const getPlayerFromDB = async (uid: string) => {
  try {
    const playerSnapshot = await getDoc(doc(db, "players", uid));
    return playerSnapshot.data() as Player;
  } catch (error) {
    console.error(`Error retrieving player with id ${uid}: `, error);
    return null;
  }
};

export const addPlayerToDB = async (uid: string, player: Player) => {
  try {
    const playerRef = doc(db, "players", uid);
    await setDoc(playerRef, player);
    console.log(`Added player to database.`);
  } catch (error) {
    console.error(`Error adding player to database: `, error);
  }
};

export const updatePlayerSchoolAndLocation = async (
  uid: string,
  location: string,
  school: string
) => {
  try {
    const playerRef = doc(db, "players", uid);
    await updateDoc(playerRef, {
      location: location,
      school: school,
    });
    console.log(
      `Added location ${location} and school ${school} to player with id ${uid}.`
    );
  } catch (error) {
    console.error(
      `Error adding location ${location} and school ${school} to player with id ${uid}: `,
      error
    );
  }
};

export const updatePlayerFeedback = async (uid: string, feedback: Feedback) => {
  const playerRef = doc(db, "players", uid);
  await updateDoc(playerRef, {
    feedbacks: arrayUnion(feedback),
  });
  console.log(`Added feedback to player with id ${uid}.`);
};

export const updatePlayerTitle = async (uid: string, title: string) => {
  const playerRef = doc(db, "players", uid);
  await updateDoc(playerRef, {
    activeTitle: title,
  });
  console.log(`Added feedback to player with id ${uid}.`);
};

export const updatePlayerWallet = async (uid: string, amount: number) => {
  const playerRef = doc(db, "players", uid);
  await updateDoc(playerRef, {
    wallet: increment(amount),
  });
};

export const increaseXP = async (uid: string, XP: number) => {
  try {
    const [battlePass, player] = await Promise.all([
      getBattlePassFromDB(),
      getPlayerFromDB(uid),
    ]);

    if (!player) {
      throw new Error(`Player with uid ${uid} does not exist`);
    }

    const { playerData, battlePassData } = player;
    // XP = addXpBoostBasedOnTitle(playerData?.activeTitle, XP);

    const { requiredXP: battlePassRequiredXP } = battlePass.tiers.find(
      (tier) => tier.tier === playerData?.currentLevel
    ) || { requiredXP: 0 };

    const canIncreaseBattlePassLevel =
      battlePassData?.currentXP + XP >= battlePassRequiredXP;
    const canIncreasePlayerLevel = playerData.currentXP + XP >= PLAYER_LEVEL_XP;
    const isAtLastLevel =
      battlePassData.currentLevel === battlePass.tiers.length;

    if (canIncreaseBattlePassLevel) {
      const { battlePassCurrentLevel } = increaseBattlePassDataTier(
        battlePassData?.currentLevel,
        battlePass
      );
      battlePassData.currentXP += XP - battlePassRequiredXP;
      battlePassData.currentLevel = battlePassCurrentLevel;

      const rewardFromBP = getRewardFromBP(
        battlePassData.currentLevel,
        battlePass
      );
      await addRewardToDB(uid, rewardFromBP);
    } else if (!isAtLastLevel) {
      battlePassData.currentXP += XP;
    }

    if (canIncreasePlayerLevel) {
      const newPlayerLevel = increasePlayerLevel(playerData.currentLevel);
      playerData.currentXP += XP - PLAYER_LEVEL_XP;
      playerData.currentLevel = newPlayerLevel;

      const collectionNamesFromDB = await getAllCollectionNamesFromDB();
      const levelsWithReward = collectionNamesFromDB.length;

      for (let i = 0; i <= levelsWithReward * 10; i += 10) {
        if (playerData.currentLevel === i) {
          const index = i / 10;
          const collection = collectionNamesFromDB[index];

          if (collection !== undefined) {
            const levelRewards = await getCollectionByName(collection);

            if (levelRewards.length) {
              await Promise.all(
                levelRewards.map(async (reward) => {
                  await addRewardToDB(uid, reward);
                })
              );
            } else {
              console.log("No rewards left");
            }
          } else {
            console.log("Invalid collection");
          }
        }
      }
    } else {
      playerData.currentXP += XP;
    }

    await updatePlayerGameData(uid, playerData, battlePassData);
  } catch (error) {
    console.error(error);
  }
};

const increasePlayerLevel = (playerLevel: number) => {
  return ++playerLevel;
};

const increaseBattlePassDataTier = (
  battlePassCurrentLevel: number,
  battlePass: BattlePass
) => {
  const isAtLastLevel = battlePassCurrentLevel === battlePass.tiers.length;
  if (!isAtLastLevel) {
    battlePassCurrentLevel++;
  }

  return { battlePassCurrentLevel };
};

const getRewardFromBP = (level: number, battlePass: BattlePass): Item => {
  const selectedLevel = battlePass.tiers.find((tier) => tier.tier === level);
  return selectedLevel?.reward as Item;
};

const addRewardToDB = async (uid: string, reward: Item) => {
  const playerRef = doc(db, "players", uid);
  await updateDoc(playerRef, {
    rewards: arrayUnion(reward),
  });
  console.log(`Added reward to player with id ${uid}.`);
};

const updatePlayerGameData = async (
  uid: string,
  playerData: Player["playerData"],
  battlePassData: Player["battlePassData"]
) => {
  const playerRef = doc(db, "players", uid);
  await updateDoc(playerRef, {
    playerData: playerData,
    battlePassData: battlePassData,
  });
};
