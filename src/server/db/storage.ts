import { storage } from "./firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
  uploadString,
} from "firebase/storage";

export const getAssetsFromStorage = async () => {
  const assetsRef = ref(storage, "assets/");

  const listResult = await listAll(assetsRef);

  const files = await Promise.all(
    listResult.items.map(async (itemRef) => {
      const { name } = await getMetadata(itemRef);
      const src = await getDownloadURL(itemRef);

      return { name, src };
    })
  );

  return files;
};

export const addQuestProofToStorage = async (
  playerId: string,
  questId: string,
  proof: string
) => {
  const storageRef = ref(storage);

  const playerFolderRef = ref(storageRef, `players/${playerId}`);
  const questsFolderRef = ref(playerFolderRef, "quests");
  const questFolderRef = ref(questsFolderRef, questId);
  const proofFileRef = ref(
    questFolderRef,
    `proof-${Date.now().toLocaleString()}.png`
  );

  await uploadString(proofFileRef, proof);

  const downloadURL = await getDownloadURL(proofFileRef);
  return downloadURL;
};

export const addWalletReceiptToStorage = async (
  playerId: string,
  receipt: string
) => {
  try {
    const storageRef = ref(storage);

    const playerFolderRef = ref(storageRef, `players/${playerId}`);
    const receiptsFolderRef = ref(playerFolderRef, "receipts");
    const receiptFileRef = ref(
      receiptsFolderRef,
      `receipt-${Date.now().toLocaleString()}.png`
    );

    await uploadString(receiptFileRef, receipt, "data_url");

    const downloadURL = await getDownloadURL(receiptFileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error occurred during file upload:", error);
    throw error;
  }
};
