import { z } from "zod";
import { ItemSchema } from "./itemUtils";
import { collection, doc, query, setDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import { Item } from "../utils/Item";

export const CollectionSchema = z.object({
  name: z.string(),
  items: z.array(ItemSchema),
});

export const addCollectionToDB = async (collection = {}) => {
  try {
    const collectionsRef = doc(db, "collections", Date.now().toString());
    await setDoc(collectionsRef, collection);
    console.log(`Added collection to database.`);
  } catch (error) {
    console.error(`Error adding collection to database: `, error);
  }
};

export const getCollectionByName = (collectionName: string) => {
  try {
    const collectionsRef = collection(db, "collections");
    const collectionsWithType = query(
      collectionsRef,
      where("name", "==", collectionName)
    ) as unknown;
    return collectionsWithType as Item[];
  } catch (err) {
    console.error(`Error getting collection from database: `, err);
  }
};
