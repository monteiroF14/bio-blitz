import { Quest } from "../quest/generateQuests";

const START_XP = 0;
const START_LEVEL = 1;
const START_QUESTS_DONE: Quest[] = [];
const START_BP_REWARDS: string[] = [];
const START_FEEDBACKS_GIVEN: Player["feedbacks"] = [];
const START_PLAYER_LEVELING_SYSTEM_REWARDS: string[] = [];

export default class Player {
  name: string;
  email: string;
  image: string;
  location: string | null;
  school: string | null;
  battlePassData: {
    currentXP: number;
    currentLevel: number;
  };
  playerData: {
    currentXP: number;
    currentLevel: number;
    questsDone: Quest[];
    title: "Beginner" | "Intermediate" | "Pro Environmentalist";
  };
  rewards: {
    battlePassRewards: string[];
    playerLevelingSystemRewards: string[];
  };
  feedbacks: {
    description: string;
    rating: number;
    creationDate: Date;
  }[];

  constructor(
    name: Player["name"],
    email: Player["email"],
    image: Player["image"]
  ) {
    this.name = name;
    this.email = email;
    this.image = image;
    this.school = null;
    this.location = null;
    this.battlePassData = {
      currentXP: START_XP,
      currentLevel: START_LEVEL,
    };
    this.playerData = {
      currentXP: START_XP,
      currentLevel: START_LEVEL,
      questsDone: START_QUESTS_DONE,
      title: "Beginner",
    };
    this.rewards = {
      battlePassRewards: START_BP_REWARDS,
      playerLevelingSystemRewards: START_PLAYER_LEVELING_SYSTEM_REWARDS,
    };
    this.feedbacks = START_FEEDBACKS_GIVEN;

    this.playerData.title = this.getTitleByLevel();
  }

  addXpBoostBasedOnTitle(XP: number, title: string) {
    switch (title) {
      case "Intermediate":
        return (XP *= 1.2);
      case "Pro Environmentalist":
        return (XP *= 1.5);
      default:
        return XP;
    }
  }

  getTitleByLevel() {
    const currentLevel = this.playerData.currentLevel;
    return currentLevel < 10
      ? "Beginner"
      : currentLevel < 20
      ? "Intermediate"
      : "Pro Environmentalist";
  }

  // async increaseXP(XP: number) {
  //   await Promise.all([
  //     battlePass.increaseXP(XP, this.battlePassData, this.rewards),
  //     playerLevelingSystem.increaseXP(
  //       this.addXpBoostBasedOnTitle(XP, this.playerData.title),
  //       this.playerData,
  //       this.rewards
  //     ),
  //   ]);
  // }
}
