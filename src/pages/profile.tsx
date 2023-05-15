import { useSession } from "next-auth/react";
import EditPlayerForm from "~/components/EditPlayerForm";
import Image from "next/image";
import Loading from "~/components/Loading";
import Head from "next/head";
import { api } from "~/utils/api";
import Player from "~/server/utils/player/PlayerClass";

const Profile = () => {
  const { data: sessionData } = useSession();
  const email = sessionData?.user.email || "";
  const playerQuery = api.player.getPlayerFromDB.useQuery(email);
  const player = playerQuery.data as Player;

  if (!sessionData || playerQuery.isLoading) {
    return <Loading />;
  }

  if (!player) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="mx-20 my-10 space-y-8">
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
      </main>
    </>
  );
};

export default Profile;
