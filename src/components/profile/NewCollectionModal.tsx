import ItemCard from "../ItemCard";
import { FormEvent, useRef, useState } from "react";
import { api } from "~/utils/api";
import Modal from "react-modal";
import { Item } from "~/server/utils/Item";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { newItemsState } from "./state/newItemsState";
import Button from "../ui/Button";

interface IModalCollection {
  newCollectionName: string | undefined;
  itemsSelect: string | undefined;
  items: Item[];
}

function NewCollectionModal({
  collectionNames,
}: {
  collectionNames: string[];
}) {
  const [toggleModal, setToggleModal] = useState(false);
  const modalRef = useRef<Modal>(null);
  const [itemsComponent, setItemsComponent] = useState<React.ReactNode[]>([]);

  const newItemsList = useRecoilValue(newItemsState);
  const setNewItemsState = useSetRecoilState(newItemsState);

  const newCollectionMutation = api.collection.addCollectionToDB.useMutation();
  const updateCollectionMutation =
    api.collection.addItemToCollection.useMutation();

  const onModalToggle = () => setToggleModal(!toggleModal);

  const handleCloseModal = () => {
    onModalToggle();
    setItemsComponent([]);
  };

  const handleAddAnotherItem = () => {
    const itemId = Date.now().toString();

    setNewItemsState((itemsFromState) => [
      ...itemsFromState,
      {
        itemId,
        name: "",
        type: "",
      },
    ]);

    setItemsComponent((prevItems) => [
      ...prevItems,
      <ItemCard key={prevItems.length} type="add" itemId={itemId} />,
    ]);
  };

  const handleModalSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    const formData = new FormData(evt.target as HTMLFormElement);
    const newCollectionFormData: IModalCollection = {
      newCollectionName:
        formData.get("newCollectionName")?.toString() || undefined,
      itemsSelect: formData.get("itemsSelect")?.toString() || undefined,
      items: newItemsList || [],
    };

    newCollectionFormData.newCollectionName
      ? delete newCollectionFormData.itemsSelect
      : delete newCollectionFormData.newCollectionName;

    const shouldCreateNewCollection =
      newCollectionFormData.hasOwnProperty("newCollectionName") &&
      newCollectionFormData.newCollectionName;

    shouldCreateNewCollection
      ? createCollection(
          newCollectionFormData.newCollectionName ?? "",
          newCollectionFormData.items
        )
      : updateCollection(
          newCollectionFormData.itemsSelect ?? "",
          newCollectionFormData.items
        );

    handleCloseModal();
  };

  const createCollection = (collectionName: string, items: Item[]) => {
    newCollectionMutation.mutate({
      items,
      name: collectionName,
    });
  };

  const updateCollection = (collectionName: string, items: Item[]) => {
    items.forEach((item) => {
      updateCollectionMutation.mutate({
        item,
        name: collectionName,
      });
    });
  };

  return (
    <>
      <Button
        variant="default"
        className="w-full sm:w-auto"
        onClick={onModalToggle}
      >
        New item or collection
      </Button>
      <Modal
        isOpen={toggleModal}
        onRequestClose={onModalToggle}
        contentLabel="New collection"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
        ref={modalRef}
      >
        <h2 className="mb-4 text-2xl font-bold">New item or collection</h2>
        <form
          className="space-y-4"
          onSubmit={handleModalSubmit}
          name="newCollectionForm"
          id="newCollectionForm"
        >
          <section className="grid gap-4">
            <section className="space-y-2">
              <label htmlFor="newCollectionName" className="font-bold ">
                Collection name:
              </label>
              <div className=" grid grid-cols-3 gap-4">
                <input
                  type="text"
                  name="newCollectionName"
                  id="newCollectionName"
                  placeholder="new collection name.."
                  className="text-ellipsis"
                />
                <p className="mx-auto">or</p>
                <select name="itemsSelect" id="itemsSelect">
                  {collectionNames.map((collectionName, idx) => (
                    <option key={idx} value={collectionName}>
                      {collectionName}
                    </option>
                  ))}
                </select>
              </div>
            </section>
            <section className="space-y-2">
              <label htmlFor="newItems" className="font-semibold">
                Items:
              </label>
              <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {itemsComponent.map((item) => item)}
                <ItemCard type="create" onClick={handleAddAnotherItem} />
              </section>
            </section>
          </section>
          <footer className="flex justify-around">
            <Button
              variant="default"
              type="submit"
              className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
            >
              Submit
            </Button>
            <Button
              variant="default"
              onClick={handleCloseModal}
              className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
            >
              Close modal
            </Button>
          </footer>
        </form>
      </Modal>
    </>
  );
}

export default NewCollectionModal;
