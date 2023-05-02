import React from "react";

const BattlePass = ({
  currentLevel,
  currentXP,
}: {
  currentLevel: number;
  currentXP: number;
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Battle Pass</h1>
      <p>Tier: {currentLevel}</p>
      <p>XP: {currentXP}</p>
    </div>
  );
};

export default BattlePass;
