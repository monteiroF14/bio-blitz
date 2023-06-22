import ItemCard from "../ItemCard";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Collection } from "~/server/utils/Collection";
import NewCollectionModal from "./NewCollectionModal";
import Button from "../ui/Button";

function AdminForm({ collectionNames }: { collectionNames: string[] }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [gridVisibility, setGridVisibility] = useState<boolean[]>([]);

  const utils = api.useContext();

  useEffect(() => {
    const fetchCollections = () => {
      return Promise.all(
        collectionNames.map(async (collectionName) => {
          const items = await utils.collection.getAllItemsFromCollection.fetch(
            collectionName
          );

          return {
            items,
            name: collectionName,
          } as Collection;
        })
      );
    };

    fetchCollections()
      .then((collections) => {
        setCollections(collections);
        setGridVisibility(collections.map(() => false));
      })
      .catch((error) => {
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
      <h1 className="mb-8 text-lg font-bold text-white sm:text-xl md:text-2xl">
        Welcome, Admin
      </h1>
      <section className="flex flex-col gap-8">
        {collectionNames.length > 0 && (
          <>
            <section className="block items-center justify-between space-y-4 sm:flex sm:space-y-0">
              <h2 className="text-base font-bold text-white sm:text-lg md:text-xl">
                All collections
              </h2>
              <NewCollectionModal collectionNames={collectionNames} />
            </section>
            {collections.map((collection, idx) => (
              <article key={idx} className="relative flex flex-col gap-4 ">
                <header className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white sm:text-base ">
                    {collection.name}
                  </h3>
                  <Button
                    variant="icon"
                    aria-label="Show more items"
                    onClick={() => handleShowMoreButton(idx)}
                    className="leading-none"
                  >
                    <FontAwesomeIcon
                      icon={gridVisibility[idx] ? faMinus : faPlus}
                    />
                  </Button>
                </header>
                <section
                  className={`grid h-24 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  ${
                    gridVisibility[idx] ? "h-full" : "h-24 overflow-hidden"
                  }`}
                >
                  {collection.items?.map((item, idx) => (
                    <ItemCard key={idx} item={item} type="show" />
                  ))}
                </section>
              </article>
            ))}
          </>
        )}
      </section>
    </>
  );
}

export default AdminForm;
