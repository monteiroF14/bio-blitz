import { Item } from "./../../../server/utils/Item";
import { atom } from "recoil";

export interface newItem extends Item {
  id: number;
}

export const newItemsState = atom({
  key: "collections",
  default: [] as newItem[],
});
