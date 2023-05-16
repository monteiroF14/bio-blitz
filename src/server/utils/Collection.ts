import { Item } from "./Item";

export class Collection {
  name: string;
  items: Item[];

  constructor({ name, items }: Collection) {
    this.name = name;
    this.items = items;
  }
}
