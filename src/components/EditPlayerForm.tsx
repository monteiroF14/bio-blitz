import { LoadScriptProps, useJsApiLoader } from "@react-google-maps/api";
import { env } from "~/env.mjs";
import Loading from "./Loading";
import SelectPlayerTitleForm from "./SelectPlayerTitleForm";
import AutoCompleteForm from "./AutoCompleteForm";
import Player from "~/server/utils/player/PlayerClass";

const libraries: LoadScriptProps["libraries"] = ["places"];

const EditPlayerForm = ({ player }: { player: Player }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) return <Loading />;

  return (
    <form className=" w-full space-y-8">
      <SelectPlayerTitleForm playerData={player.playerData} />
      <AutoCompleteForm email={player.email} />
      <button
        type="submit"
        className="w-1/3 rounded-lg bg-blue-700 p-2.5 px-12 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
};

export default EditPlayerForm;
