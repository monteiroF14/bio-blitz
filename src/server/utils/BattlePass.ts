import { Item } from "./Item";

export class BattlePass {
  readonly tiers: {
    tier: number;
    requiredXP: number;
    reward: Item | undefined;
  }[];
  readonly expiringAt: Date | string;

  constructor(startXP: number, maxLevel: number, items: Item[]) {
    this.tiers = Array.from({ length: maxLevel }, (_, i) => {
      const tierIndex = ++i;

      const getItemMultiplier = items.filter((item) => item?.multiplier);

      const chooseItemWithMultiplier = (
        idx: number,
        itemsWithMultiplier: Item[]
      ) => {
        const index = idx + 1;

        return index === 15
          ? itemsWithMultiplier.find((item) => item.multiplier === 1.5)
          : index === 25
          ? itemsWithMultiplier.find((item) => item.multiplier === 2)
          : itemsWithMultiplier.find((item) => item.multiplier === 1);
      };

      const reward =
        tierIndex % 10 === 0
          ? this.getItemByType(items, "money")
          : tierIndex % 5 === 0 && tierIndex >= 5
          ? chooseItemWithMultiplier(tierIndex, getItemMultiplier)
          : tierIndex % 3 === 0
          ? this.getItemByType(items, "font")
          : Math.random() < 0.5
          ? this.getItemByType(items, "backgroundImage")
          : this.getItemByType(items, "avatarBorder");

      return {
        tier: tierIndex,
        requiredXP: startXP,
        reward: reward,
      };
    });

    const date = new Date();
    this.expiringAt = new Date(date.setMonth(date.getMonth() + 1));
  }

  private getItemByType(getAllItemsFromDB: Item[], type: string): Item {
    const item = getAllItemsFromDB.find((item) => item.type === type);
    if (!item) {
      throw new Error(`No item found with type "${type}"`);
    }
    return item;
  }
}
