import { Item } from "../Item";

export interface Feedback {
  description: string;
  rating: number;
  creationDate: Date;
}

const START_XP = 0;
const START_LEVEL = 1;
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
    activeTitle: string;
  };
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
      activeTitle: "Beginner",
    };
    this.rewards = START_PLAYER_REWARDS;
    this.feedbacks = START_FEEDBACKS_GIVEN;
  }
}

export function addXpBoostBasedOnTitle(title: string, XP: number) {
  switch (title) {
    case "Intermediate":
      return (XP *= 1.2);
    case "Pro Environmentalist":
      return (XP *= 1.5);
    default:
      return XP;
  }
}
