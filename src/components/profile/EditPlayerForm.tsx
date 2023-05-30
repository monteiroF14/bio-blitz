import SelectPlayerTitleForm from "./SelectPlayerTitleForm";
import SelectSchoolForm from "./SelectSchoolForm";
import Player from "~/server/utils/player/PlayerClass";
import { api } from "~/utils/api";
import { hashEmail } from "../Header";

type EditProfileData = {
  [key: string]: string | File;
};

const EditPlayerForm = ({ player }: { player: Player }) => {
  const editPlayerSchool = api.player.updatePlayerSchool.useMutation();
  const editPlayerTitle = api.player.updatePlayerTitle.useMutation();

  const handleEditProfileFormSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);

    const editProfileData: EditProfileData = Object.fromEntries(
      formData.entries()
    ) as EditProfileData;

    const { playerTitleCombo: selectedTitle, schoolsInput: selectedSchool } =
      editProfileData;

    editPlayerTitle.mutate({
      uid: hashEmail(player.email),
      title: selectedTitle as string,
    });

    editPlayerSchool.mutate({
      school: selectedSchool as string,
      uid: hashEmail(player.email),
    });
  };

  return (
    <form className=" w-full space-y-8" onSubmit={handleEditProfileFormSubmit}>
      <SelectPlayerTitleForm playerData={player.playerData} />
      <SelectSchoolForm />
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
