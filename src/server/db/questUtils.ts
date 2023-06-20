import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  runTransaction,
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

export const addQuestToDB = async (questId: string, quest: Quest) => {
  const questRef = doc(db, "quests", questId);
  await setDoc(questRef, quest);
  console.log(`Added quest with id ${questId}`);
};

export const deleteQuestFromDB = async (questId: string) => {
  const questRef = doc(db, "quests", questId);
  await deleteDoc(questRef);
  console.log(`Deleted quest with id ${questId}`);
};

export const getAllQuestsByTypeFromPlayer = async (
  uid: string,
  type: Quest["type"]
) => {
  const collectionRef = collection(db, "quests");

  const questQuery = query(
    collectionRef,
    where("playerId", "==", uid),
    where("type", "==", type)
  );

  const questsSnapshot = await getDocs(questQuery);
  const questsArray = questsSnapshot.docs.map((doc) => doc.data());

  return questsArray as Quest[];
};

export const increaseQuestFrequency = async (questId: string) => {
  const questRef = doc(db, "quests", questId);
  await runTransaction(db, async (transaction) => {
    const questDoc = await transaction.get(questRef);

    if (questDoc.exists()) {
      const currentFrequency = (questDoc.data()?.frequency as number) || 0;

      if (currentFrequency < 3) {
        transaction.update(questRef, {
          frequency: increment(1),
        });
      }
    }
  });
};
