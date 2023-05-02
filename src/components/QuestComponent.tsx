import React, { useState } from "react";

interface QuestComponentProps {
  questId: string;
  description: string;
  XP: number;
}

export const QuestComponent = ({
  questId,
  description,
}: QuestComponentProps) => {
  const [isQuestDone, setIsQuestDone] = useState(false);
  const [questCompletionProof, setQuestCompletionProof] = useState<string>("");

  const handleQuestSubmission = () => {
    setIsQuestDone(true);
    setQuestCompletionProof("https://example.com/questCompletionProof");
  };

  return (
    <article className="grid grid-cols-[1fr_25%] items-center gap-4">
      {isQuestDone ? (
        <p>Quest completed. Proof: {questCompletionProof}</p>
      ) : (
        <>
          <label htmlFor={questId}>{description}</label>
          <button
            className="rounded border-2 border-zinc-900 bg-transparent px-4 py-2 font-bold text-zinc-900 dark:border-white dark:text-white"
            onClick={handleQuestSubmission}
          >
            submit
          </button>
        </>
      )}
    </article>
  );
};

export default QuestComponent;
