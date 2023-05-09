import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import Player, { addXpBoostBasedOnTitle } from "../utils/player/PlayerClass";
import { getBattlePassFromDB } from "./battlePassUtils";
import { BattlePass } from "../utils/BattlePass";

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
  email: string,
  feedback: { description: string; rating: number; creationDate: Date }
) => {
  const player = await getPlayerFromDB(email);
  player?.feedbacks.push(feedback);

  const playerRef = doc(db, "players", email);
  await updateDoc(playerRef, {
    feedbacks: player?.feedbacks,
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

    const battlePassLevelCanBeIncreased =
      battlePassData?.currentXP + XP >= battlePassRequiredXP;
    if (battlePassLevelCanBeIncreased) {
      const { playerCurrentLevel, battlePassCurrentLevel } = increaseTier(
        playerData?.currentLevel,
        battlePassData?.currentLevel,
        battlePass
      );
      battlePassData.currentXP += XP - battlePassRequiredXP;

      playerData.currentLevel = playerCurrentLevel;
      battlePassData.currentLevel = battlePassCurrentLevel;

      //TODO: gerar uma reward
      // const generatedReward = generateReward(battlePass, battlePassData);
      // addRewardToDB(generatedReward)
    } else {
      battlePassData.currentXP += XP;
    }

    //TODO: dar fix nisto já que não dá update ao player na DB
    await updatePlayerGameData(email, playerData, battlePassData);
    return await getPlayerFromDB(email);
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

const generateReward = () => {
  //TODO: fazer o código para gerar as rewards
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
