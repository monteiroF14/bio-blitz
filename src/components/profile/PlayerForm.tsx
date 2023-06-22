import Player from "~/server/utils/player/PlayerClass";
import SelectPlayerTitleForm from "./SelectPlayerTitleForm";
import SelectSchoolForm from "./SelectSchoolForm";
import { api } from "~/utils/api";
import { hashEmail } from "../ui/Header";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { Item } from "~/server/utils/Item";
import Wallet from "../Wallet";
import Heading from "../ui/Heading";

type EditProfileData = {
  [key: string]: string | File;
};

type PlayerStyles = {
  backgrounds: Item[];
  borders: Item[];
};

const SelectUIPreferences = ({
  playerData,
  playerStyles,
}: {
  playerData: Player["playerData"];
  playerStyles: PlayerStyles;
}) => {
  const { preferences: userPreferences } = playerData;

  return (
    <>
      <section className="grid gap-2">
        <label className=" text-zinc-50" htmlFor="background">
          Background:
        </label>
        <Select variant="default" id="background" name="background">
          <option value={userPreferences.activeBackground?.name}>
            {userPreferences.activeBackground?.name === "default_background.png"
              ? "default"
              : userPreferences.activeBackground?.name}
          </option>
          {playerStyles.backgrounds.map(({ itemId, name }) => (
            <option value={itemId} key={itemId}>
              {name}
            </option>
          ))}
        </Select>
      </section>
      <section className="grid gap-2">
        <label className="text-zinc-50" htmlFor="border">
          Border:
        </label>
        <Select variant="default" id="border" name="border">
          <option value={userPreferences.activeAvatarBorder?.name}>
            {userPreferences.activeAvatarBorder?.name === "default_border.png"
              ? "default"
              : userPreferences.activeAvatarBorder?.name}
          </option>
          {playerStyles.borders.map(({ itemId, name }) => (
            <option value={itemId} key={itemId}>
              {name}
            </option>
          ))}
        </Select>
      </section>
    </>
  );
};

function PlayerForm({ player }: { player: Player }) {
  const editPlayerSchool = api.player.updatePlayerSchool.useMutation();
  const editPlayerTitle = api.player.updatePlayerTitle.useMutation();
  const editPlayerPreferences =
    api.player.updatePlayerPreferences.useMutation();

  const handleEditProfileFormSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);

    const editProfileData: EditProfileData = Object.fromEntries(
      formData.entries()
    ) as EditProfileData;

    const {
      playerTitleCombo: selectedTitle,
      schoolsInput: selectedSchool,
      background,
      border,
    } = editProfileData;

    editPlayerTitle.mutate({
      uid: hashEmail(player.email),
      title: selectedTitle as string,
    });

    editPlayerSchool.mutate({
      school: selectedSchool as string,
      uid: hashEmail(player.email),
    });

    const preferences: Record<string, Item> = {};

    if (border !== "default") {
      const avatarBorder = player.rewards.find(
        (reward) => reward.itemId === border
      );

      preferences.activeAvatarBorder = avatarBorder as Item;
    }

    if (background !== "default") {
      const backgroundImage = player.rewards.find(
        (reward) => reward.itemId === background
      );

      preferences.activeBackground = backgroundImage as Item;
    }

    if (Object.keys(preferences).length > 0) {
      editPlayerPreferences.mutate({
        uid: hashEmail(player.email),
        preferences,
      });
    }
  };

  const playerStyles = {
    backgrounds: player.rewards.filter(
      ({ type }) => type === "backgroundImage"
    ),
    borders: player.rewards.filter(({ type }) => type === "avatarBorder"),
  };

  return (
    <>
      <Heading variant="h1">Hello, {player.name}</Heading>
      <form
        className="grid w-full space-y-8"
        onSubmit={handleEditProfileFormSubmit}
      >
        <SelectUIPreferences
          playerData={player.playerData}
          playerStyles={playerStyles}
        />
        <SelectPlayerTitleForm playerData={player.playerData} />
        <SelectSchoolForm selectedSchool={player.school ?? "NO SCHOOL"} />

        <Button
          variant="default"
          type="submit"
          className="w-fit place-self-center px-12 sm:px-24 md:px-36 lg:px-48"
        >
          Submit
        </Button>
      </form>
      <Wallet player={player} />
    </>
  );
}

export default PlayerForm;
