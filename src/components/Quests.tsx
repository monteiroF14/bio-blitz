import { useSession } from "next-auth/react";
import { hashEmail } from "./ui/Header";
import { api } from "~/utils/api";
import { useState, Fragment } from "react";
import Button from "./ui/Button";
import QuestComponent from "./QuestComponent";
import Heading from "./ui/Heading";

const Quests = () => {
  const [activeTab, setActiveTab] =
    useState<keyof typeof playerQuests>("daily");

  const { data: sessionData } = useSession();
  const playerId = sessionData?.user?.email
    ? hashEmail(sessionData?.user?.email)
    : "";

  const { data: dailyQuests } = api.quest.getAllQuestsByTypeFromPlayer.useQuery(
    {
      type: "daily",
      uid: playerId,
    }
  );
  const { data: weeklyQuests } =
    api.quest.getAllQuestsByTypeFromPlayer.useQuery({
      type: "weekly",
      uid: playerId,
    });
  const { data: monthlyQuests } =
    api.quest.getAllQuestsByTypeFromPlayer.useQuery({
      type: "monthly",
      uid: playerId,
    });

  const playerQuests = {
    daily: dailyQuests ?? [],
    weekly: weeklyQuests ?? [],
    monthly: monthlyQuests ?? [],
  };

  const handleTabClick = (questType: keyof typeof playerQuests) => {
    setActiveTab(questType);
  };

  return (
    <section className="grid w-full gap-4">
      <Heading variant="h2">Quests</Heading>
      <section className="grid gap-4 border-4 border-zinc-950 bg-zinc-950/50">
        <header className="grid grid-cols-3 items-center">
          {Object.keys(playerQuests).map((questType) => (
            <Fragment key={questType}>
              <Button
                variant={activeTab === questType ? "activeTab" : "tab"}
                onClick={() =>
                  handleTabClick(questType as keyof typeof playerQuests)
                }
              >
                {questType}
              </Button>
            </Fragment>
          ))}
        </header>
        <section className="space-y-4 px-4 pb-4">
          {playerQuests[activeTab].map((quest) => (
            <QuestComponent quest={quest} key={quest.questId} />
          ))}
        </section>
      </section>
    </section>
  );
};

export default Quests;
