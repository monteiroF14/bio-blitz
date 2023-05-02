import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getAllPlayersFromDB = async () => {
  const playersSnapshot = await getDocs(collection(db, "players"));
  return playersSnapshot.docs.map((doc) => doc.data());
};

export const getPlayerFromDB = async (email: string) => {
  const playerSnapshot = await getDoc(doc(db, "players", email));
  return playerSnapshot.data();
};

export const addPlayerToDB = async (email: string, player = {}) => {
  const playerRef = doc(db, "players", email);
  await setDoc(playerRef, player);
};
