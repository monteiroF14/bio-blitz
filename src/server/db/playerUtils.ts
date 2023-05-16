import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import Player, {
  Feedback,
  addXpBoostBasedOnTitle,
} from "../utils/player/PlayerClass";
import { getBattlePassFromDB } from "./battlePassUtils";
import { BattlePass } from "../utils/BattlePass";
import { Item } from "../utils/Item";

export const getAllPlayersFromDB = async () => {
  try {
    const playersSnapshot = await getDocs(collection(db, "players"));
    return playersSnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error retrieving all players: ", error);
    return [];
  }
};

export const getPlayerFromDB = async (email: string) => {
  try {
    const playerSnapshot = await getDoc(doc(db, "players", email));
    return playerSnapshot.data() as Player;
  } catch (error) {
    console.error(`Error retrieving player with email ${email}: `, error);
    return null;
  }
};

export const addPlayerToDB = async (email: string, player = {}) => {
  try {
    const playerRef = doc(db, "players", email);
    await setDoc(playerRef, player);
    console.log(`Added player with email ${email} to database.`);
  } catch (error) {
    console.error(
      `Error adding player with email ${email} to database: `,
      error
    );
  }
};

export const updatePlayerSchoolAndLocation = async (
  email: string,
  location: string,
  school: string
) => {
  try {
    const playerRef = doc(db, "players", email);
    await updateDoc(playerRef, {
      location: location,
      school: school,
    });
    console.log(
      `Added location ${location} and school ${school} to player with email ${email}.`
    );
  } catch (error) {
    console.error(
      `Error adding location ${location} and school ${school} to player with email ${email}: `,
      error
    );
  }
};

export const updatePlayerFeedback = async (
  feedback: Feedback,
  email: Player["email"]
) => {
  const playerRef = doc(db, "players", email);
  await updateDoc(playerRef, {
    feedbacks: arrayUnion(feedback),
  });
  console.log(`Added feedback to player with email ${email}.`);
};

export const increaseXP = async (email: string, XP: number) => {
  try {
    const [battlePass, player] = await Promise.all([
      getBattlePassFromDB(),
      getPlayerFromDB(email),
    ]);

    if (!player) {
      throw new Error(`Player with email ${email} does not exist`);
    }

    const { playerData, battlePassData } = player;
    XP = addXpBoostBasedOnTitle(playerData?.activeTitle, XP);

    const { requiredXP: battlePassRequiredXP } = battlePass.tiers.find(
      (tier) => tier.tier === playerData?.currentLevel
    ) || { requiredXP: 0 };

    const canIncreaseBattlePassLevel =
      battlePassData?.currentXP + XP >= battlePassRequiredXP;
    const isAtLastLevel =
      battlePassData.currentLevel === battlePass.tiers.length;

    if (canIncreaseBattlePassLevel) {
      const { playerCurrentLevel, battlePassCurrentLevel } = increaseTier(
        playerData?.currentLevel,
        battlePassData?.currentLevel,
        battlePass
      );
      battlePassData.currentXP += XP - battlePassRequiredXP;

      playerData.currentLevel = playerCurrentLevel;
      battlePassData.currentLevel = battlePassCurrentLevel;

      const rewardFromBP = getRewardFromBP(
        battlePassData.currentLevel,
        battlePass
      );
      await addRewardToDB(rewardFromBP, email);
    } else if (!isAtLastLevel) {
      battlePassData.currentXP += XP;
    }

    await updatePlayerGameData(email, playerData, battlePassData);
  } catch (error) {
    console.error(error);
  }
};

const increaseTier = (
  playerCurrentLevel: Player["playerData"]["currentLevel"],
  battlePassCurrentLevel: Player["battlePassData"]["currentLevel"],
  battlePass: BattlePass
) => {
  const isAtLastLevel = battlePassCurrentLevel === battlePass.tiers.length;
  if (!isAtLastLevel) {
    battlePassCurrentLevel++;
  }
  // playerCurrentLevel++;

  return { playerCurrentLevel, battlePassCurrentLevel };
};

const getRewardFromBP = (level: number, battlePass: BattlePass): Item => {
  const selectedLevel = battlePass.tiers.find((tier) => tier.tier === level);
  return selectedLevel?.reward as Item;
};

const addRewardToDB = async (reward: Item, email: Player["email"]) => {
  const playerRef = doc(db, "players", email);
  await updateDoc(playerRef, {
    rewards: arrayUnion(reward),
  });
  console.log(`Added reward to player with email ${email}.`);
};

const updatePlayerGameData = async (
  email: Player["email"],
  playerData: Player["playerData"],
  battlePassData: Player["battlePassData"]
) => {
  const playerRef = doc(db, "players", email);
  await updateDoc(playerRef, {
    playerData: playerData,
    battlePassData: battlePassData,
  });
};

//TODO: pegar todas as rewards do player e adicionar todos os items de uma collection que ele não tem
//                                                  ou
//TODO: criar somehow os temas e simplesmente adicionar 1 atrás do outro, sendo igual para todos os players
