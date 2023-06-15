import { storage } from "./firebase";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";

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
