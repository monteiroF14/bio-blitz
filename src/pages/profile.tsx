import { getSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import Player from "~/server/utils/player/PlayerClass";
import Header, { hashEmail } from "~/components/ui/Header";
import { GetServerSidePropsContext } from "next";
import { getPlayerFromDB } from "~/server/db/playerUtils";
import PlayerForm from "~/components/profile/PlayerForm";
import AdminForm from "~/components/profile/AdminForm";
import { signOut } from "next-auth/react";
import Button from "~/components/ui/Button";
import { useCallback } from "react";

const Profile = ({ player }: { player: Player }) => {
  const collectionNamesFromDB =
    api.collection.getAllCollectionNames.useQuery().data || [];

  const isUserAdmin = player.userType === "admin";

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: "/api/auth/signin" });
  }, []);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Header shouldGoBack={true} />
      <main className="space-y-8">
        {isUserAdmin ? (
          <AdminForm collectionNames={collectionNamesFromDB} />
        ) : (
          <PlayerForm player={player} />
        )}
        {/* eslint-disable-next-line */}
        <Button onClick={handleSignOut} variant="signOut">
          Sign Out
        </Button>
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
