import ItemCard from "../ItemCard";
import { FormEvent, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { Collection } from "~/server/utils/Collection";
import { Item } from "~/server/utils/Item";

interface INewCollection {
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

  const newCollectionMutation = api.collection.addCollectionToDB.useMutation();

  const onModalToggle = () => setToggleModal(!toggleModal);

  const handleCloseModal = () => {
    onModalToggle();
    setItemsComponent([]);
  };

  const handleAddAnotherItem = () => {
    setItemsComponent((prevItems) => [
      ...prevItems,
      <ItemCard key={prevItems.length} type="add" />,
    ]);
  };

  const handleNewCollectionSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    const formData = new FormData(evt.target as HTMLFormElement);
    const newCollectionFormData = Object.fromEntries(formData.entries());

    console.log(itemsComponent);

    newCollectionFormData.newCollectionName
      ? delete newCollectionFormData.itemsSelect
      : delete newCollectionFormData.newCollectionName;

    console.log("newCollectionFormData: ", newCollectionFormData);

    //TODO: pegar o state do ItemCard e transformar na INewCollection
  };

  return (
    <>
      <button
        className="dark:focus:ring-bio-bg-bio-red-500 w-1/4 rounded-lg bg-bio-red-500 p-2.5 px-12 text-center text-sm font-medium text-white hover:bg-bio-red-500 focus:outline-none focus:ring-4 focus:ring-bio-red-200 dark:bg-bio-red-400 dark:hover:bg-bio-red-500"
        onClick={onModalToggle}
      >
        New collection
      </button>
      <Modal
        isOpen={toggleModal}
        onRequestClose={onModalToggle}
        contentLabel="New collection"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
        ref={modalRef}
      >
        <h2 className="mb-4 text-2xl font-bold">New collection</h2>
        <form
          className="space-y-4"
          onSubmit={handleNewCollectionSubmit}
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
            <button
              type="submit"
              className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
            >
              Submit
            </button>
            <button
              onClick={handleCloseModal}
              className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
            >
              Close modal
            </button>
          </footer>
        </form>
      </Modal>
    </>
  );
}

function AdminForm({ collectionNames }: { collectionNames: string[] }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [gridVisibility, setGridVisibility] = useState<boolean[]>([]);

  const utils = api.useContext();

  useEffect(() => {
    const fetchCollections = async () => {
      const newCollections: Collection[] = [];

      for (const collection of collectionNames) {
        const items = await utils.item.getAllItemsFromCollection.fetch(
          collection
        );

        newCollections.push({
          items: items || [],
          name: collection,
        });
      }

      setCollections(newCollections);
      setGridVisibility(newCollections.map(() => false));
    };

    fetchCollections().catch((error) => {
      console.error("Error fetching collections:", error);
    });
  }, [collectionNames]);

  const handleShowMoreButton = (index: number) => {
    const updatedVisibility = [...gridVisibility];
    updatedVisibility[index] = !updatedVisibility[index];
    setGridVisibility(updatedVisibility);
  };

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold text-white">Welcome, Admin</h1>
      <section className="flex flex-col gap-8">
        {collectionNames.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">All collections</h2>
              <NewCollectionModal collectionNames={collectionNames} />
            </div>
            {collections.map((collection, idx) => {
              return (
                <article key={idx} className="relative flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-white">
                    {collection.name}
                  </h3>
                  <button
                    className="absolute right-0 top-0 text-2xl font-bold text-white"
                    aria-label="Show more items"
                    onClick={() => handleShowMoreButton(idx)}
                  >
                    <FontAwesomeIcon icon={faEllipsis} className="px-2 py-1" />
                  </button>
                  <section
                    className={`grid h-24 grid-cols-4 gap-4 transition-all duration-200 ease-in-out ${
                      gridVisibility[idx] ? "h-full" : "h-24 overflow-hidden"
                    }`}
                  >
                    {collection.items?.map((item, idx) => (
                      <ItemCard key={idx} item={item} type="show" />
                    ))}
                  </section>
                </article>
              );
            })}
          </>
        )}
      </section>
    </>
  );
}

export default AdminForm;
