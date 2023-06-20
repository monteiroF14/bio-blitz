import BattlePassWidget from "~/components/BattlePassWidget";
import Header from "~/components/ui/Header";
import Quests from "~/components/Quests";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Header shouldGoBack={false} />
      <main>
        <Quests />
        <BattlePassWidget />
      </main>
    </>
  );
};

export default Home;
