import { Quest } from "~/server/utils/quest/generateQuests";
import { hashEmail } from "./ui/Header";
import { useSession } from "next-auth/react";
import QuestModal from "./QuestModal";

export const QuestComponent = ({ quest }: { quest: Quest }) => {
  const { data: sessionData } = useSession();
  const playerId = sessionData?.user?.email
    ? hashEmail(sessionData?.user?.email)
    : "";

  const { description, frequency, currentFrequency } = quest;

  return (
    <>
      <article className="flex items-center justify-between gap-4">
        <p className="flex w-full justify-between text-ellipsis text-zinc-50">
          {description}
          <span className="text-zinc-400">
            ({currentFrequency}/{frequency})
          </span>
        </p>
        <QuestModal quest={quest} player={playerId} />
      </article>
    </>
  );
};

export default QuestComponent;
