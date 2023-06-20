import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import { hashEmail } from "./ui/Header";
import Link from "next/link";
import Image from "next/image";

const BP_LEVEL_XP = 5000;

const BattlePassWidget = () => {
  const { data: sessionData } = useSession();
  const playerId = sessionData?.user?.email
    ? hashEmail(sessionData?.user?.email)
    : "";

  const { data: playerData } = api.player.getPlayerFromDB.useQuery(playerId);
  const { data: battlePass } = api.battlePass.getBattlePassFromDB.useQuery();

  if (!playerData) return null;

  const { battlePassData } = playerData;

  const playerTier = battlePass?.tiers.find(
    (tier) => tier.tier === battlePassData.currentLevel
  );

  const missingXP = BP_LEVEL_XP - battlePassData.currentXP;

  const tierReward = playerTier?.reward;

  return (
    <main className="my-10 space-y-8">
      <h1 className="text-2xl font-bold text-white">Battle Pass</h1>
      <Link href="/battle-pass">
        <section className="flex items-center justify-between">
          <p className="text-base font-bold text-gray-300">
            Current Tier: {battlePassData.currentLevel}
          </p>
          <p className="text-base font-bold text-gray-300">
            Current XP: {battlePassData.currentXP}
          </p>
        </section>
        <p>Missing XP: {missingXP}</p>
        <section>
          REWARD:{" "}
          {tierReward?.src && (
            <Image src={tierReward?.src} alt={tierReward.name} />
          )}
        </section>
      </Link>
    </main>
  );
};

export default BattlePassWidget;
