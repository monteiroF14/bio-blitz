import React from "react";
import Player from "~/server/utils/player/PlayerClass";
import QRCode from "qrcode";
import { api } from "~/utils/api";
import { hashEmail } from "./Header";

const Wallet = ({ player }: { player: Player }) => {
  const withdrawFromWallet = api.player.updatePlayerWallet.useMutation();

  const updateWallet = async (amount: number) => {
    try {
      if (player.wallet >= amount) {
        await withdrawFromWallet.mutateAsync({
          uid: hashEmail(player.email),
          amount: -amount,
        });
        console.log("Wallet updated successfully");
        const qrcode = await generateQrcode(amount);
        console.log(qrcode);
      } else {
        console.error("Not enough credits!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generateQrcode = async (amount: number) => {
    return await QRCode.toDataURL(`${amount}€ voucher!`);
  };

  return (
    <>
      <p className="block dark:border-gray-700 dark:text-white ">
        {player.wallet}€
      </p>
      {/* eslint-disable-next-line */}
      <button onClick={async () => await updateWallet(1)}>
        Generate QR Code
      </button>
    </>
  );
};

export default Wallet;
