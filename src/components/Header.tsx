import React, { useEffect } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Player from "~/utils/player/Player";
import { api } from "~/utils/api";

const LinkHeader = ({ text, url }: { text: string; url?: string }) => {
  const href = url ? `/${url}` : "/";

  return (
    <Link
      href={href}
      className="block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
    >
      {text}
    </Link>
  );
};

const Header = () => {
  const { data: sessionData } = useSession();
  const email = sessionData?.user?.email ?? "";
  const { data: doesPlayerExist } = api.player.getPlayerFromDB.useQuery(email, {
    enabled: !!email,
  });

  const addPlayerMutation = api.player.addPlayerToDB.useMutation();

  useEffect(() => {
    if (!doesPlayerExist) {
      if (!sessionData) return;
      const { name, email, image } = sessionData.user;
      const newPlayer = new Player(name, email, image);
      addPlayerMutation.mutate(newPlayer);
    }
  }, [sessionData, doesPlayerExist, addPlayerMutation]);

  return (
    <header className="flex items-center gap-8 px-12 py-6 dark:bg-gray-900">
      <Link href="/" aria-labelledby="Logo">
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          bioBlitz
        </span>
      </Link>
      <nav className="ml-auto flex gap-8">
        <LinkHeader text="Home" />
        <LinkHeader text="Feedback" url="feedback" />
        <LinkHeader text="Account" url="account" />
      </nav>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </header>
  );
};

export default Header;
