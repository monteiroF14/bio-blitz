import { useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect } from "react";
import { api } from "~/utils/api";
import { BattlePass as BattlePassClass } from "~/server/utils/BattlePass";

const BattlePass = () => {
  const { data: sessionData } = useSession();
  const { email = "" } = sessionData?.user || {};

  const createBP = api.battlePass.addBattlePassToDB.useMutation();
  const getAllItemsFromDB = api.item.getAllItemsFromDB.useQuery().data || [];
  const battlePass = api.battlePass.getBattlePassFromDB.useQuery().data;
  const playerBattlePassData =
    api.player.getPlayerFromDB.useQuery(email).data?.battlePassData;
  const increasePlayerXPMutation = api.player.increasePlayerXP.useMutation();

  // useEffect(() => {
  //   const itemsNotInReward = getAllItemsFromDB
  //     ? getAllItemsFromDB.filter(
  //         (item) =>
  //           !battlePass?.tiers.flatMap((tier) => tier.reward).includes(item)
  //       )
  //     : [];
  //   createBP.mutate(new BattlePassClass(5000, 30, itemsNotInReward));
  // }, []);

  if (!battlePass || !playerBattlePassData) return;

  const handleIncreaseXP = () => {
    increasePlayerXPMutation.mutate({
      email: email,
      XP: 3000,
    });
  };

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
            <button
              className="w-fit rounded-lg bg-blue-700 p-2.5 px-12 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleIncreaseXP}
            >
              Increase XP
            </button>
          </section>
        </section>
      </main>
    </>
  );
};

export default BattlePass;
