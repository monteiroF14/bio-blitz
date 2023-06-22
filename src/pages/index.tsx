import BattlePassWidget from "~/components/BattlePassWidget";
import Header from "~/components/ui/Header";
import Quests from "~/components/Quests";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Header shouldGoBack={false} />
      <main className="grid gap-8 lg:flex lg:justify-between lg:gap-16">
        <Quests />
        <BattlePassWidget />
      </main>
    </>
  );
};

export default Home;
