import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Quest } from "../utils/quest/generateQuests";

export const getAllQuestsByType = async (type: Quest["type"]) => {
  const questsSnapshot = await getDocs(
    query(collection(db, "quests"), where("type", "==", type))
  );
  return questsSnapshot.docs.map((doc) => doc.data()) as Quest[];
};

export const addQuestToDB = async (questId: string, quest = {}) => {
  const questRef = doc(db, "quest", questId);
  await setDoc(questRef, quest);
  console.log(`Added quest with id ${questId}`);
};

export const deleteQuestFromDB = async (questId: string) => {
  const questRef = doc(db, "quest", questId);
  await deleteDoc(questRef);
  console.log(`Deleted quest with id ${questId}`);
};
