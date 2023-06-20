import { addDays, addWeeks, addMonths } from "date-fns";
import { uuid } from "uuidv4";

export interface Quest {
  questId: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  XP: number;
  expiringDate: Date;
  frequency: number;
  currentFrequency: number;
  status: "completed" | "in-progress" | "not-started";
}

const getExpiringDate = (questType: Quest["type"]): Date => {
  const now = new Date();

  switch (questType) {
    case "daily":
      return addDays(now, 1);
    case "weekly":
      return addWeeks(now, 1);
    case "monthly":
      return addMonths(now, 1);
  }
};

const setXpBasedOnType = (questType: Quest["type"]) => {
  switch (questType) {
    case "daily":
      return 2000;
    case "weekly":
      return 5000;
    case "monthly":
      return 10000;
  }
};

const generateQuestFrequency = (max: number) => {
  const randomDecimal = Math.random();
  return Math.floor(randomDecimal * max) + 1;
};

export const generateQuests = (
  numberOfQuests: number,
  questType: Quest["type"]
): Quest[] => {
  const getQuestDescription = (): string => {
    //TODO: write this function
    return "";
  };

  return Array.from({ length: numberOfQuests }, () => ({
    questId: uuid(),
    description: getQuestDescription(),
    type: questType,
    XP: setXpBasedOnType(questType),
    frequency: generateQuestFrequency(3),
    currentFrequency: 0,
    status: "in-progress",
    expiringDate: getExpiringDate(questType),
  }));
};
