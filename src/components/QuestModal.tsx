import { useCallback, useEffect, useState } from "react";
import Button from "./ui/Button";
import { Quest } from "~/server/utils/quest/generateQuests";
import {
  faUpRightAndDownLeftFromCenter,
  faUpload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Heading from "./ui/Heading";
import { api } from "~/utils/api";
import { Modal, ModalInterface, ModalOptions } from "flowbite";

const QUEST_PROOF =
  "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fst2.depositphotos.com%2F1575949%2F5696%2Fv%2F950%2Fdepositphotos_56963813-stock-illustration-proof-red-stamp-text.jpg&f=1&nofb=1&ipt=ba4f5b12c3ffd0119914b48a3edabff2ac9f8ae33f9d267e2ef46f753c5c490e&ipo=images";

const QuestModal = ({ quest, player }: { quest: Quest; player: string }) => {
  const [modal, setModal] = useState<ModalInterface>();
  const [isQuestDone, setIsQuestDone] = useState(false);

  const toggleModal = useCallback(() => {
    modal?.toggle();
  }, [modal]);

  useEffect(() => {
    const $modalElement: HTMLElement = document.getElementById(
      "questModal"
    ) as HTMLElement;

    const modalOptions: ModalOptions = {
      placement: "center",
      backdrop: "dynamic",
      closable: true,
      onHide: () => {
        console.log("modal is hidden");
      },
      onShow: () => {
        console.log("modal is shown");
      },
      onToggle: () => {
        console.log("modal has been toggled");
      },
    };

    setModal(new Modal($modalElement, modalOptions));
  }, []);

  const { questId, type, frequency, description, XP, currentFrequency } = quest;

  const addQuestProof = api.storage.addQuestProofToStorage.useMutation();
  const increaseQuestFrequency = api.quest.increaseQuestFrequency.useMutation();

  const handleUploadProof = () => {
    addQuestProof.mutate({
      playerId: player,
      proof: QUEST_PROOF,
      questId: questId,
    });
    increaseQuestFrequency.mutate({
      questId: questId,
    });
  };

  useEffect(() => {
    if (currentFrequency === frequency) {
      setIsQuestDone(true);
    }
  }, [currentFrequency, frequency]);

  return (
    <>
      {isQuestDone ? (
        <Heading variant="h4" className="text-zinc-100">
          completed!
        </Heading>
      ) : (
        <Button
          variant="icon"
          className="border-4 border-solid border-current bg-zinc-100 p-1 px-2 text-zinc-950"
          onClick={toggleModal}
        >
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
        </Button>
      )}
      <section
        id="questModal"
        tabIndex={-1}
        aria-hidden="true"
        data-modal-target="questModal"
        className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0"
      >
        <section className="relative max-h-full w-full max-w-2xl space-y-8 rounded-lg bg-white p-4 text-zinc-100 shadow dark:bg-zinc-950/90">
          <header className="flex w-full items-center justify-between">
            <Heading variant="h2" className="text-zinc-100">
              {type} Quest
            </Heading>
            <Button
              variant="icon"
              onClick={toggleModal}
              data-modal-hide="questModal"
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-zinc-800 dark:hover:text-white"
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </header>
          <main className="space-y-6">
            <Heading variant="h4">{description}</Heading>
            <p>{XP}XP</p>
            <p>
              Done: {currentFrequency}/{frequency}
            </p>
          </main>
          <footer className="flex items-center border-gray-200">
            {currentFrequency === frequency ? (
              <Button
                data-modal-hide="questModal"
                variant="default"
                onClick={toggleModal}
              >
                Close
              </Button>
            ) : (
              <>
                <Button variant="default" onClick={handleUploadProof}>
                  UPLOAD PROOF:
                  <span className="p-2">
                    <FontAwesomeIcon icon={faUpload} />
                  </span>
                </Button>
                <Button
                  variant="default"
                  onClick={toggleModal}
                  data-modal-hide="questModal"
                >
                  Cancel
                </Button>
              </>
            )}
          </footer>
        </section>
      </section>
    </>
  );
};

export default QuestModal;
