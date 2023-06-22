import React, { useState } from "react";
import Player from "~/server/utils/player/PlayerClass";
import { api } from "~/utils/api";
import Button from "./ui/Button";
import { hashEmail } from "./ui/Header";
import { InfoModal } from "./ui/InfoModal";
import Link from "next/link";

const WITHDRAW_MONEY = 5;

const Wallet = ({ player }: { player: Player }) => {
  const [wasWithdrawn, setWasWithdrawn] = useState<boolean | null>(null);
  const [receipt, setReceipt] = useState("");
  const withdrawFromWallet = api.player.updatePlayerWallet.useMutation();

  const updateWallet = async (amount: number) => {
    try {
      const newReceipt = await withdrawFromWallet.mutateAsync({
        amount: -amount,
        uid: hashEmail(player.email),
      });

      setWasWithdrawn(true);
      setReceipt(newReceipt);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {wasWithdrawn && (
        <InfoModal variant="success">
          <Link href={receipt}>Open receipt</Link>
        </InfoModal>
      )}
      <section className="flex items-center justify-between">
        <p className="block dark:border-gray-700 dark:text-white ">
          Balance: {player.wallet}€
        </p>
        {player.wallet >= WITHDRAW_MONEY && (
          <Button
            variant="default"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={async () => {
              setWasWithdrawn(null);
              await updateWallet(WITHDRAW_MONEY);
            }}
            type="button"
          >
            Withdraw
          </Button>
        )}
      </section>
    </>
  );
};

export default Wallet;
