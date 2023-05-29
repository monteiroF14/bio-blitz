import { getSession } from "next-auth/react";
import EditPlayerForm from "~/components/EditPlayerForm";
import Image from "next/image";
import Head from "next/head";
import { api } from "~/utils/api";
import Player from "~/server/utils/player/PlayerClass";
import { hashEmail } from "~/components/Header";
import ItemCard from "~/components/ItemCard";
import { GetServerSidePropsContext } from "next";
import { getPlayerFromDB } from "~/server/db/playerUtils";
import React, { useEffect, useState } from "react";
import { Item } from "~/server/utils/Item";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);
  const uid = session?.user?.email ? hashEmail(session.user.email) : "";

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const player = await getPlayerFromDB(uid);

  return {
    props: {
      player: player,
    },
  };
};

function PlebeForm({ player }: { player: Player }) {
  return (
    <>
      <h1 className="text-2xl font-bold text-white">Hello, {player.name}</h1>
      <section className="grid grid-cols-2 gap-8">
        <EditPlayerForm player={player} />
        <Image
          src={player.image}
          alt={`${player.name}'s profile picture'`}
          width={200}
          height={200}
          priority={true}
          className="mx-auto rounded-full"
        />
      </section>
    </>
  );
}

function AdminForm({ collectionNames }: { collectionNames: string[] }) {
  interface Collection {
    items: Item[];
    name: string;
  }

  const [shouldOverflow, setShouldOverflow] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);

  collectionNames.map((collection) => {
    setCollections([
      ...collections,
      {
        items:
          api.item.getAllItemsFromCollection.useQuery(collection).data || [],
        name: collection,
      },
    ]);
  });

  const handleShowMoreButton = () => setShouldOverflow(!shouldOverflow);

  return (
    <>
      <h1 className="text-2xl font-bold text-white">Welcome, Admin</h1>
      <section className="space-y-8">
        {collectionNames.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-white">All collections</h2>
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
                    {shouldOverflow ? "+" : "-"}
                  </button>
                  <section
                    className={`grid h-24 grid-cols-4 gap-4 ${
                      shouldOverflow ? "overflow-hidden" : ""
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

const Profile = ({ player }: { player: Player }) => {
  const isUserAdmin = player.userType === "admin";
  const collectionNamesFromDB =
    api.item.getCollectionNamesFromAllItems.useQuery().data || [];

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="mx-20 my-10 space-y-8">
        {isUserAdmin ? (
          <AdminForm collectionNames={collectionNamesFromDB} />
        ) : (
          <PlebeForm player={player} />
        )}
      </main>
    </>
  );
};

export default Profile;
