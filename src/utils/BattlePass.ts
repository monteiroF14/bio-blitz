class BattlePass {
  readonly tiers: { tier: number; requiredXP: number }[];
  readonly battlePassId: string;
  readonly expiringAt: Date;

  constructor(startXP: number, maxLevel: number) {
    this.battlePassId = Date.now().toString();
    this.tiers = Array.from({ length: maxLevel }, (_, i) => ({
      tier: i + 1,
      requiredXP: startXP * (i + 1),
    }));
    const date = new Date();
    this.expiringAt = new Date(date.setMonth(date.getMonth() + 1));
  }
}

export default BattlePass;
