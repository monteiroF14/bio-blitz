import { type NextPage } from "next";
import QuestModal from "~/components/QuestModal";

const Home: NextPage = () => {
  return (
    <>
      <main>
        <h1>Main page</h1>
        <QuestModal />
      </main>
    </>
  );
};

export default Home;
