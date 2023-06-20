import React, { useState } from "react";
import Button from "./ui/Button";
import { Quest } from "~/server/utils/quest/generateQuests";

export const QuestComponent = ({ quest }: { quest: Quest }) => {
  const [isQuestDone, setIsQuestDone] = useState(false);
  const [questCompletionProof, setQuestCompletionProof] = useState<string>("");

  const handleQuestSubmission = () => {
    setIsQuestDone(true);
    setQuestCompletionProof("https://example.com/questCompletionProof");
  };

  const { description, frequency, currentFrequency } = quest;

  return (
    <article className="flex items-center justify-between gap-4">
      {isQuestDone ? (
        <p>Quest completed. Proof: {questCompletionProof}</p>
      ) : (
        <>
          <p className="flex w-full justify-between text-ellipsis text-zinc-50">
            {description}
            <span className="text-zinc-400">
              ({currentFrequency}/{frequency})
            </span>
          </p>
          <Button variant="default" onClick={handleQuestSubmission}>
            Submit
          </Button>
        </>
      )}
    </article>
  );
};

export default QuestComponent;
