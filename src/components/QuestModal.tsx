import React from "react";
import { Quest } from "~/utils/quest/generateQuests";

const QuestModal = (quest: Quest) => {
  return (
    <>
      <h3>{quest.type}</h3>
      <p>{quest.XP}</p>
      <p>{quest.description}</p>
      <p>
        {quest.currentFrequency}/{quest.frequency}
      </p>
      <p>{quest.expiringDate.toDateString()}</p>
      <p>{quest.status}</p>
    </>
  );
};

export default QuestModal;
