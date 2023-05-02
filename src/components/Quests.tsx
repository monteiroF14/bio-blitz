import React, { memo } from "react";
// import QuestComponent from "./QuestComponent";
import type { Quest } from "../utils/quest/generateQuests";

const Quests = () => {
  const renderQuests = (questType: Quest["type"]) => {
    // const questArray = (quests as { [key: string]: Quest[] })[
    //   questType + "Quests"
    // ];

    // if (!questArray) return;

    return (
      <>
        <h2 className="text-xl font-bold">{`${questType
          .charAt(0)
          .toUpperCase()}${questType.slice(1)} quests:`}</h2>
        {/* {questArray.map((quest) => (
          <QuestComponent
            key={quest.questId}
            XP={quest.XP}
            description={quest.description}
            questId={quest.questId}
          />
        ))} */}
      </>
    );
  };

  return (
    <section className="flex w-full grow flex-col gap-8 md:gap-4">
      {renderQuests("daily")}
      {/* {renderQuests("weekly")}
            {renderQuests("monthly")} */}
    </section>
  );
};

export default memo(Quests);
