import { getSession } from "next-auth/react";
import Head from "next/head";
import { hashEmail } from "~/components/Header";
import { GetServerSidePropsContext } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { playerRouter } from "~/server/api/routers/playerRouter";

const BattlePass = ({
  playerBattlePassData,
}: {
  playerBattlePassData: {
    currentXP: number;
    currentLevel: number;
  };
}) => {
  return (
    <>
      <Head>
        <title>Battle Pass</title>
      </Head>
      <main className="mx-20 my-10 space-y-8">
        <h1 className="text-2xl font-bold text-white">Battle Pass</h1>
        <section>
          <section className="flex items-center justify-between">
            <p className="text-base font-bold text-gray-300">
              Current Tier: {playerBattlePassData.currentLevel}
            </p>
            <p className="text-base font-bold text-gray-300">
              Current XP: {playerBattlePassData.currentXP}
            </p>
          </section>
        </section>
      </main>
    </>
  );
};

export default BattlePass;

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

  const playerData = createServerSideHelpers({
    router: playerRouter,
    ctx: {},
  });

  const player = await playerData.getPlayerFromDB.fetch(uid);
  const playerBattlePassData = player?.battlePassData || null;

  return {
    props: {
      playerBattlePassData,
    },
  };
};
