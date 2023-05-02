import Image from "next/image";
import React from "react";

interface Rewards {
  battlePassRewards: string[];
  playerLevelingSystemRewards: string[];
}

const PlayerRewards = ({ rewards }: { rewards: Rewards }) => (
  <>
    <h2>Rewards from level up: </h2>
    {rewards.playerLevelingSystemRewards.map((reward, index) => (
      <Image key={index} src={reward} alt="QR Code" />
    ))}
    <h2>Rewards from battle pass: </h2>
    {rewards.battlePassRewards.map((reward, index) => (
      <Image key={index} src={reward} alt="QR Code" />
    ))}
  </>
);

export default PlayerRewards;
