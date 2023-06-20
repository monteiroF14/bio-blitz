import Player from "~/server/utils/player/PlayerClass";
import SelectPlayerTitleForm from "./SelectPlayerTitleForm";
import SelectSchoolForm from "./SelectSchoolForm";
import { api } from "~/utils/api";
import { hashEmail } from "../ui/Header";
import Button from "../ui/Button";

type EditProfileData = {
  [key: string]: string | File;
};

function PlayerForm({ player }: { player: Player }) {
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
    <>
      <h1 className="text-2xl font-bold text-white">Hello, {player.name}</h1>
      <form className="w-full space-y-8" onSubmit={handleEditProfileFormSubmit}>
        <SelectPlayerTitleForm playerData={player.playerData} />
        <SelectSchoolForm />
        <Button variant="default" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}

export default PlayerForm;
