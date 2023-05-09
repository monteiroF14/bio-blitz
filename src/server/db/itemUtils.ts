import {
  doc,
  query,
  setDoc,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { Item } from "../utils/Item";
import { db } from "./firebase";
import { z } from "zod";

export const ItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  amount: z.number().optional(),
  src: z.string().optional(),
  collection: z.string().optional(),
});

export const getAllItemsFromCollection = (collectionName: string) => {
  const itemsRef = collection(db, "items");
  const itemsWithCollection = query(
    itemsRef,
    where("collection", "==", collectionName)
  );
  return itemsWithCollection;
};

export const getItemByType = (type: string) => {
  const itemsRef = collection(db, "items");
  const itemsWithType = query(itemsRef, where("type", "==", type)) as unknown;
  return itemsWithType as Item;
};

export const getAllItemsFromDB = async () => {
  try {
    const itemsSnapshot = await getDocs(collection(db, "items"));
    return itemsSnapshot.docs.map((doc) => doc.data()) as Item[];
  } catch (error) {
    console.error("Error retrieving all players: ", error);
    return [];
  }
};

export const addItemToDB = async (item: Item) => {
  try {
    const itemsRef = doc(db, "items", Date.now().toString());
    await setDoc(itemsRef, item);
    console.log(`Added item with type ${item.type} to database.`);
  } catch (error) {
    console.error(
      `Error adding item with type ${item.type} to database: `,
      error
    );
    throw new Error("Failed to retrieve items from database.");
  }
};
