export class BattlePass {
  readonly tiers: { tier: number; requiredXP: number }[];
  readonly expiringAt: Date | string;

  constructor(startXP: number, maxLevel: number) {
    this.tiers = Array.from({ length: maxLevel }, (_, i) => ({
      tier: i + 1,
      requiredXP: startXP,
    }));
    const date = new Date();
    this.expiringAt = new Date(date.setMonth(date.getMonth() + 1));
  }
}
