import React, { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Player from "~/server/utils/player/PlayerClass";
import crypto from "crypto";
import Image from "next/image";
import Router from "next/router";
import { Item } from "~/server/utils/Item";

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

  const borderFromAssets = storageAssets?.find(
    (asset) => asset.name === "default_border.png"
  );

  const goBackBtn = storageAssets?.find((asset) => asset.name === "goback.png");

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
      const { data: storageAssets } =
        api.storage.getAssetsFromStorage.useQuery();

      const borderFromAssets = storageAssets?.find(
        (asset) => asset.name === "default_border.png"
      );

      const bgFromAssets = storageAssets?.find(
        (asset) => asset.name === "default_background.png"
      );

      const DEFAULT_BORDER: Item = {
        itemId: Date.now().toString(),
        name: borderFromAssets?.name ?? "",
        src: borderFromAssets?.src,
        type: "avatarBorder",
      };

      const DEFAULT_BACKGROUND: Item = {
        itemId: Date.now().toString(),
        name: bgFromAssets?.name ?? "",
        src: bgFromAssets?.src,
        type: "backgroundImage",
      };

      const preferences: Player["playerData"]["preferences"] = {
        activeAvatarBorder: DEFAULT_BORDER,
        activeBackground: DEFAULT_BACKGROUND,
      };

      const { name, email, image } = sessionData.user;
      const newPlayer = new Player(name, email, image, preferences);
      addPlayerMutation.mutate({ uid: hashEmail(email), player: newPlayer });

      const updateBodyBackground = () => {
        const bodyElement = document.body;
        if (preferences.activeBackground?.src) {
          bodyElement.style.backgroundImage = `url(${preferences.activeBackground?.src})`;
        } else {
          bodyElement.style.backgroundImage = "#101010";
        }
        bodyElement.style.backgroundRepeat = "no-repeat";
        bodyElement.style.backgroundPosition = "center";
        bodyElement.style.backgroundSize = "cover";
      };

      updateBodyBackground();
    }
  }, [sessionData, getPlayerQuery.isLoading]);

  return (
    <header className="my-4 grid grid-cols-3 place-items-center bg-transparent">
      {shouldGoBack ? (
        goBackBtn && (
          <Image
            src={goBackBtn.src}
            alt={"Go Back"}
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
            className="object-contain"
            sizes="max-width: 100%"
          />
        )}
      </Link>
      <Link
        href="/profile"
        className="relative aspect-square h-14 overflow-hidden rounded-full "
      >
        {sessionData ? (
          getPlayerQuery.data &&
          getPlayerQuery.data.playerData.preferences.activeAvatarBorder
            ?.src && (
            <>
              <Image
                src={
                  getPlayerQuery.data.playerData.preferences.activeAvatarBorder
                    ?.src
                }
                alt="Avatar Border"
                fill
                sizes="max-width: 100%"
                className="z-10"
              />
              <Image
                src={getPlayerQuery.data.image}
                alt={getPlayerQuery.data.name}
                fill
                sizes="max-width: 100%"
              />
            </>
          )
        ) : (
          <Image
            src={greyImageBG}
            alt="User profile picture"
            fill
            sizes="max-width: 100%"
          />
        )}
      </Link>
    </header>
  );
};

export default Header;
