export class Item {
  name: string;
  type: string;
  amount?: number;
  src?: string;
  collection?: string;
  multiplier?: number;

  constructor({ name, type, src, collection, amount, multiplier }: Item) {
    this.name = name;
    this.type = type;
    this.src = src;
    this.collection = collection;
    this.amount = amount;
    this.multiplier = multiplier;
  }
}
