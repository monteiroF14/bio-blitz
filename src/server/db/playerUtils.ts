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
// import { getBattlePassFromDB } from "./battlePassUtils";
import { BattlePass } from "../utils/BattlePass";
import { Item } from "../utils/Item";
import {
  getAllCollectionNamesFromDB,
  getCollectionByName,
} from "./collectionUtils";
import { getBattlePassFromDB } from "./battlePassUtils";

const PLAYER_LEVEL_XP = 4000;

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

export const updatePlayerSchool = async (uid: string, school: string) => {
  try {
    const playerRef = doc(db, "players", uid);
    await updateDoc(playerRef, {
      school: school,
    });
    console.log(`Added school ${school} to player with id ${uid}.`);
  } catch (error) {
    console.error(
      `Error adding school ${school} to player with id ${uid}: `,
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
    "playerData.activeTitle": title,
  });
  console.log(`Added feedback to player with id ${uid}.`);
};

const addPlayerTitle = async (uid: string, title: string) => {
  const playerRef = doc(db, "players", uid);
  await updateDoc(playerRef, {
    "playerData.titles": arrayUnion(title),
  });
  console.log(`Added title to player with id ${uid}.`);
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
    XP *= playerData.xpMultiplier;

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

      await addRewardToDB(uid, rewardFromBP, player);
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
                  await addRewardToDB(uid, reward, player);
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

const addRewardToDB = async (uid: string, reward: Item, player: Player) => {
  const playerRef = doc(db, "players", uid);
  switch (reward.type) {
    case "money": {
      if (reward.amount) await updatePlayerWallet(uid, reward.amount);
      break;
    }
    case "title": {
      if (
        reward.multiplier &&
        player.playerData.xpMultiplier <= reward.multiplier
      ) {
        await updatePlayerXpMultiplier(uid, reward.multiplier);
      }

      await addPlayerTitle(uid, reward.name);
      break;
    }
    default:
      await updateDoc(playerRef, {
        rewards: arrayUnion(reward),
      });
      console.log(`Added reward to player.`);
  }
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

const updatePlayerXpMultiplier = async (uid: string, xpMultiplier: number) => {
  const playerRef = doc(db, "players", uid);
  await updateDoc(playerRef, {
    "playerData.xpMultiplier": xpMultiplier,
  });
};

export interface School {
  business_status: string;
  name: string;
  rating: number;
  place_id: string;
}

interface PlacesResponse {
  results?: School[];
}

export const fetchSchools = async (API_URL: string) => {
  try {
    const placesResponse = await fetch(API_URL);

    if (!placesResponse.ok) {
      throw new Error("Request failed");
    }

    const data = (await placesResponse.json()) as PlacesResponse;

    const schools: School[] =
      data.results
        ?.map((result: School) => ({
          business_status: result.business_status,
          name: result.name,
          rating: result.rating,
          place_id: result.place_id,
        }))
        .filter(
          ({ rating, business_status }) =>
            rating >= 2 && business_status === "OPERATIONAL"
        ) || [];

    return schools;
  } catch (error) {
    console.error("Error fetching schools:", error);
    return [];
  }
};
