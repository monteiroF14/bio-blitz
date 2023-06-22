import { getSession } from "next-auth/react";
import Head from "next/head";
import Header, { hashEmail } from "~/components/ui/Header";
import { GetServerSidePropsContext } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { battlePassRouter } from "~/server/api/routers/battlePassRouter";
import { BattlePass as TBattlePass } from "~/server/utils/BattlePass";
import Image from "next/image";
import Player from "~/server/utils/player/PlayerClass";
import { getPlayerFromDB } from "~/server/db/playerUtils";
import Heading from "~/components/ui/Heading";

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <section className="h-16 bg-zinc-900">
      <section
        className="h-full bg-green-600"
        style={{ width: `${progress}%` }}
      ></section>
    </section>
  );
};

const BattlePassTier = ({
  tier: { reward, tier },
}: {
  tier: TBattlePass["tiers"][number];
}) => {
  return (
    <article className="grid grid-cols-2 items-center border-2 border-zinc-950 p-2">
      {reward?.src ? (
        <Image src={reward?.src} alt={reward.name} width={40} height={40} />
      ) : (
        reward?.type
      )}
      <section>
        <p>Tier: {tier}</p>
        <p>{reward?.name}</p>
      </section>
    </article>
  );
};

const BattlePass = ({
  battlePass,
  player,
}: {
  battlePass: TBattlePass;
  player: Player;
}) => {
  const { battlePassData } = player;

  const playerTier = battlePass?.tiers.find(
    (tier) => tier.tier === battlePassData.currentLevel
  );

  if (!playerTier) return null;

  const progress = Math.floor(
    (battlePassData.currentXP / playerTier.requiredXP) * 100
  );

  return (
    <>
      <Head>
        <title>Battle Pass</title>
      </Head>
      <Header shouldGoBack={true} />
      <main className="mb-20 grid gap-12">
        <Heading variant="h1">Battle Pass</Heading>
        <ProgressBar progress={progress} />
        <section className="grid gap-2">
          {battlePass.tiers.map((tier) => (
            <BattlePassTier key={tier.tier} tier={tier} />
          ))}
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

  const bpRouter = createServerSideHelpers({
    router: battlePassRouter,
    ctx: {},
  });

  const player = JSON.parse(
    JSON.stringify(await getPlayerFromDB(uid))
  ) as Player;

  const battlePass = await bpRouter.getBattlePassFromDB.fetch();

  return {
    props: {
      battlePass,
      player: player || null,
    },
  };
};
