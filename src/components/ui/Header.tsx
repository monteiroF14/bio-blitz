import React, { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Player from "~/server/utils/player/PlayerClass";
import crypto from "crypto";
import Image from "next/image";
import Router from "next/router";

const greyImageBG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEWIiIhYZW6zAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC";

export const hashEmail = (email: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(email);
  return hash.digest("hex");
};

const Header = ({ shouldGoBack }: { shouldGoBack: boolean }) => {
  const { data: sessionData } = useSession();
  const email = sessionData?.user?.email
    ? hashEmail(sessionData.user.email)
    : "";

  const { data: storageAssets } = api.storage.getAssetsFromStorage.useQuery();

  const bioBlitzLogo = storageAssets?.find(
    (asset) => asset.name.replace(".png", "") === "logo"
  );
  const bioBlitzSymbol = storageAssets?.find(
    (asset) => asset.name === "symbol"
  );

  const getPlayerQuery = api.player.getPlayerFromDB.useQuery(email, {
    enabled: !!email,
  });
  const addPlayerMutation = api.player.addPlayerToDB.useMutation();

  useEffect(() => {
    if (getPlayerQuery.isLoading) return;

    if (
      sessionData &&
      sessionData.user.email &&
      !getPlayerQuery.isSuccess &&
      !getPlayerQuery.isLoading
    ) {
      const { name, email, image } = sessionData.user;
      const newPlayer = new Player(name, email, image);
      addPlayerMutation.mutate({ uid: hashEmail(email), player: newPlayer });
    }
  }, [sessionData, getPlayerQuery.isLoading]);

  return (
    <header className="my-4 grid grid-cols-3 place-items-center bg-transparent">
      {shouldGoBack ? (
        bioBlitzLogo && (
          <Image
            src={bioBlitzLogo.src}
            alt={"bioBlitz - logo"}
            width={50}
            height={50}
            onClick={() => Router.back()}
            className="cursor-pointer"
          />
        )
      ) : (
        <div></div>
      )}
      <Link href="/" aria-labelledby="Logo" className="relative h-32 w-full">
        {bioBlitzLogo && (
          <Image
            src={bioBlitzLogo.src}
            alt={"bioBlitz - logo"}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 100%)"
          />
        )}
      </Link>
      <Link
        href="/profile"
        className="relative aspect-square h-14 overflow-hidden rounded-full "
      >
        {sessionData ? (
          getPlayerQuery.data && (
            <Image
              src={getPlayerQuery.data.image}
              alt={getPlayerQuery.data.name}
              fill
              sizes="(max-width: 100%)"
            />
          )
        ) : (
          <Image src={greyImageBG} alt="User profile picture" fill />
        )}
      </Link>
    </header>
  );
};

export default Header;
