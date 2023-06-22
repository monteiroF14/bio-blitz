import {
  ElementType,
  FC,
  HTMLProps,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import Heading from "./Heading";
import Button from "./Button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalInterface } from "flowbite";

type ModalProps = HTMLProps<HTMLDivElement> & {
  variant: "success" | "error";
  children?: ReactNode;
};

const SuccessModal: FC<ModalProps & { toggleModal: () => void }> = ({
  children,
  toggleModal,
}) => {
  return (
    <section
      id="infoModal"
      tabIndex={-1}
      aria-hidden="true"
      data-modal-target="infoModal"
      className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full overflow-y-auto overflow-x-hidden md:inset-0"
    >
      <section className="space-y-4 rounded-lg bg-zinc-900 p-4 shadow-lg">
        <header className="flex w-full items-center justify-between">
          <Heading variant="title" className="text-zinc-100">
            Success!
          </Heading>
          <Button
            variant="icon"
            onClick={toggleModal}
            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="infoModal"
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </header>
        <main className="p-6">{children}</main>
        <footer>
          <Button
            data-modal-hide="successModal"
            variant="default"
            onClick={toggleModal}
            className="w-full"
          >
            Close
          </Button>
        </footer>
      </section>
    </section>
  );
};

const ErrorModal: FC<ModalProps & { toggleModal: () => void }> = ({
  children,
  toggleModal,
}) => {
  return (
    <section
      id="infoModal"
      tabIndex={-1}
      aria-hidden="true"
      data-modal-target="infoModal"
      className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0"
    >
      <section className="space-y-4 rounded-lg bg-zinc-900 p-4 shadow-lg">
        <header className="flex w-full items-center justify-between">
          <Heading variant="title" className="text-zinc-100">
            Error!
          </Heading>
          <Button
            variant="icon"
            onClick={toggleModal}
            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="infoModal"
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </header>
        <main className="p-6">{children}</main>
        <footer>
          <Button
            data-modal-hide="successModal"
            variant="default"
            onClick={toggleModal}
            className="w-full"
          >
            Close
          </Button>
        </footer>
      </section>
    </section>
  );
};

const InfoModal: FC<ModalProps> = ({ variant, children }) => {
  const variants = {
    success: SuccessModal,
    error: ErrorModal,
  };

  const Tag: ElementType = variants[variant];
  const modalRef = useRef<ModalInterface | null>(null);

  const toggleModal = () => {
    modalRef.current?.toggle();
  };

  useEffect(() => {
    modalRef.current = new Modal(document.getElementById("infoModal"));

    modalRef.current.show();
  }, []);

  if (!Tag) {
    return null;
  }

  return (
    <Tag ref={modalRef} toggleModal={toggleModal}>
      {children}
    </Tag>
  );
};

InfoModal.displayName = "InfoModal";

export { InfoModal };
