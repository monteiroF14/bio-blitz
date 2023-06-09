import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { RecoilRoot } from "recoil";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Head>
          <title>bioBlitz</title>
        </Head>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
