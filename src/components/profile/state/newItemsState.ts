import { Item } from "./../../../server/utils/Item";
import { atom } from "recoil";

export const newItemsState = atom({
  key: "collections",
  default: [] as Item[],
});
