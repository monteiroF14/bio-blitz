import ItemCard from "../ItemCard";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { Collection } from "~/server/utils/Collection";
import NewCollectionModal from "./NewCollectionModal";

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
                  {/* TODO: animate the gridVisibility & change the icons based if the grid is visible or not */}
                  <section
                    className={`grid h-24 grid-cols-4 gap-4  ${
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
