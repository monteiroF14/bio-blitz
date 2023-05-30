import Player from "~/server/utils/player/PlayerClass";
import EditPlayerForm from "./EditPlayerForm";
import Image from "next/image";

function PlayerForm({ player }: { player: Player }) {
  return (
    <>
      <h1 className="text-2xl font-bold text-white">Hello, {player.name}</h1>
      <section className="grid grid-cols-2 gap-8">
        <EditPlayerForm player={player} />
        <Image
          src={player.image}
          alt={`${player.name}'s profile picture'`}
          width={200}
          height={200}
          priority={true}
          className="mx-auto rounded-full"
        />
      </section>
    </>
  );
}

export default PlayerForm;
