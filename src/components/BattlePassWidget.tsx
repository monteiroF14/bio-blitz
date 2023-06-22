import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import { hashEmail } from "./ui/Header";
import Link from "next/link";
import Image from "next/image";
import Heading from "./ui/Heading";

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
    <section className="grid w-full gap-4">
      <Heading variant="h2">Battle Pass</Heading>
      <section className="h-fit">
        <Link
          href="/battle-pass"
          className="grid gap-4 border-4 border-zinc-950 bg-white p-4"
        >
          <section className="block items-center justify-between space-y-2 sm:flex sm:space-y-0">
            <Heading variant="h6" className=" w-full text-zinc-100">
              Current Tier: {battlePassData.currentLevel}
            </Heading>
            <Heading variant="h6" className=" w-full text-zinc-100">
              Current XP: {battlePassData.currentXP}
            </Heading>
          </section>
          <Heading variant="h5">Missing XP: {missingXP}</Heading>
          <section className="grid grid-cols-2">
            <Heading variant="h3">Reward:</Heading>
            <section className="relative">
              {tierReward?.src && (
                <Image
                  src={tierReward?.src}
                  alt={tierReward.name}
                  width={100}
                  height={100}
                  className="mx-auto object-contain"
                />
              )}
            </section>
          </section>
        </Link>
      </section>
    </section>
  );
};

export default BattlePassWidget;
