import { Item } from "~/server/utils/Item";
import ItemCard from "../ItemCard";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

function AdminForm({ collectionNames }: { collectionNames: string[] }) {
  interface Collection {
    items: Item[];
    name: string;
  }

  const [shouldHideGrid, setShouldHideGrid] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);

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
    };

    fetchCollections().catch((error) => {
      console.error("Error fetching collections:", error);
    });
  }, [collectionNames]);

  const handleShowMoreButton = () => setShouldHideGrid(!shouldHideGrid);

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold text-white">Welcome, Admin</h1>
      <section className="flex flex-col gap-8">
        {collectionNames.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">All collections</h2>
              <button className="dark:focus:ring-bio-bg-bio-red-500 w-1/4 rounded-lg bg-bio-red-500 p-2.5 px-12 text-center text-sm font-medium text-white hover:bg-bio-red-500 focus:outline-none focus:ring-4 focus:ring-bio-red-200 dark:bg-bio-red-400 dark:hover:bg-bio-red-500">
                New collection
              </button>
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
                    onClick={handleShowMoreButton}
                  >
                    <FontAwesomeIcon icon={faEllipsis} className="px-2 py-1" />
                  </button>
                  <section
                    className={`grid h-24 grid-cols-4 gap-4 transition-all duration-200 ease-in-out ${
                      !shouldHideGrid ? "h-full" : "h-24 overflow-hidden"
                    }`}
                  >
                    {collection.items?.map((item, idx) => (
                      <ItemCard key={idx} item={item} />
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
