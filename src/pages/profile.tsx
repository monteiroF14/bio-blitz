import { getSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import Player from "~/server/utils/player/PlayerClass";
import { hashEmail } from "~/components/Header";
import { GetServerSidePropsContext } from "next";
import { getPlayerFromDB } from "~/server/db/playerUtils";
import PlayerForm from "~/components/profile/PlayerForm";
import AdminForm from "~/components/profile/AdminForm";

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
          <PlayerForm player={player} />
        )}
      </main>
    </>
  );
};

export default Profile;

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

  const player = JSON.parse(
    JSON.stringify(await getPlayerFromDB(uid))
  ) as Player;

  return {
    props: {
      player: player || null,
    },
  };
};
