import { Item } from "../Item";

export interface Feedback {
  description: string;
  rating: number;
  creationDate: Date;
}

const START_XP = 0;
const START_LEVEL = 1;
const START_XP_MULTIPLIER = 1;
const START_WALLET_VALUE = 0;
const START_FEEDBACKS_GIVEN: Player["feedbacks"] = [];
const START_PLAYER_REWARDS: Player["rewards"] = [];

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
    titles: string[];
    xpMultiplier: number;
    activeTitle: string;
  };
  wallet: number;
  userType: string;
  rewards: Item[];
  feedbacks: Feedback[];

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
      titles: ["Beginner"],
      xpMultiplier: START_XP_MULTIPLIER,
      activeTitle: "Beginner",
    };
    this.wallet = START_WALLET_VALUE;
    this.userType = "user";
    this.rewards = START_PLAYER_REWARDS;
    this.feedbacks = START_FEEDBACKS_GIVEN;
  }
}
