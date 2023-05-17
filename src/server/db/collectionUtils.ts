import { z } from "zod";
import { ItemSchema } from "./itemUtils";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Item } from "../utils/Item";
import { Collection } from "../utils/Collection";

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

export const getCollectionByName = async (collectionName: string) => {
  try {
    const collectionsRef = collection(db, "collections");
    const querySnapshot = await getDocs(
      query(collectionsRef, where("name", "==", collectionName))
    );

    if (querySnapshot.empty) {
      throw new Error(`No collection found with name: ${collectionName}`);
    }

    const document = querySnapshot.docs[0];
    return document?.data().items as Item[];
  } catch (err) {
    console.error(`Error getting collection from database: `, err);
    throw err;
  }
};

export const getAllCollectionNamesFromDB = async () => {
  try {
    const collectionsSnapshot = await getDocs(collection(db, "collections"));
    const collectionNames = collectionsSnapshot.docs.flatMap((doc) =>
      doc.data()
    ) as Collection[];
    return collectionNames.map((collection) => collection.name);
  } catch (error) {
    console.error("Error retrieving collection names from items: ", error);
    return [];
  }
};
