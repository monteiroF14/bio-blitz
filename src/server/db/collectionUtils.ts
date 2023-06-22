import { z } from "zod";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
  CollectionReference,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { Item } from "../utils/Item";
import { Collection } from "../utils/Collection";

export const ItemSchema = z.object({
  itemId: z.string(),
  name: z.string(),
  type: z.string(), //TODO: create type presets
  amount: z.number().optional(),
  multiplier: z.number().optional(),
  src: z.string().optional(),
});

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

export const addItemToCollection = async (
  collectionName: string,
  item: Item
) => {
  try {
    const collectionRef = collection(db, "collections");
    const querySnapshot = await getDocs(
      query(collectionRef, where("name", "==", collectionName), limit(1))
    );

    const docSnapshot = querySnapshot.docs[0];

    if (!querySnapshot.empty && docSnapshot) {
      const docRef = doc(db, "collections", docSnapshot.id);
      await updateDoc(docRef, {
        items: arrayUnion(item),
      });
    } else {
      console.error("No collection with given name!");
    }
  } catch (err) {
    console.error(err);
  }
};

export const getAllItemsFromCollection = async (
  collectionName: string
): Promise<Item[]> => {
  const collectionsRef: CollectionReference = collection(db, "collections");
  const itemsQuery = query(collectionsRef, where("name", "==", collectionName));

  const querySnapshot: QuerySnapshot = await getDocs(itemsQuery);

  return querySnapshot.docs.flatMap(
    (doc: QueryDocumentSnapshot) => doc.data().items as Item[]
  );
};

export const deleteItemFromCollection = async (itemId: string) => {
  try {
    const collectionsRef: CollectionReference = collection(db, "collections");
    const querySnapshot = await getDocs(collectionsRef);

    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const items = doc.data().items as Item[];
        const updatedItems = items.filter((item) => item.itemId !== itemId);
        const docRef = doc.ref;

        await updateDoc(docRef, { items: updatedItems });
      })
    );
  } catch (err) {
    console.error(err);
  }
};
