import React from "react";
import Player from "~/server/utils/player/PlayerClass";
import Select from "../ui/Select";

const SelectPlayerTitleForm = ({
  playerData,
}: {
  playerData: Player["playerData"];
}) => {
  const { activeTitle, titles } = playerData;

  return (
    <section className="w-full">
      <label
        htmlFor="playerTitleCombo"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Current title:
      </label>
      <Select
        variant="default"
        name="playerTitleCombo"
        id="playerTitleCombo"
        defaultValue={activeTitle}
      >
        <option value={activeTitle}>{activeTitle}</option>
        {titles.map(
          (title) =>
            title !== activeTitle && <option key={title}>{title}</option>
        )}
      </Select>
    </section>
  );
};

export default SelectPlayerTitleForm;
