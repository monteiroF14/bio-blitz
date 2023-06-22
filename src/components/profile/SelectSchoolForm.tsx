import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import Select from "../ui/Select";

const SelectSchoolForm = ({ selectedSchool }: { selectedSchool: string }) => {
  const options = {
    key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    query: "school",
  };

  const API_URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${options.query}&key=${options.key}`;

  const schoolsFromAPI = api.player.fetchSchools.useQuery({
    url: API_URL,
  }).data;

  return (
    <section className="w-full">
      <label
        htmlFor="schoolsInput"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Select school:
      </label>
      <Select
        variant="default"
        name="schoolsInput"
        id="schoolsInput"
        defaultValue="ESMAD"
        required
      >
        <option value={selectedSchool}>{selectedSchool}</option>
        {schoolsFromAPI?.map(({ place_id, name }) => (
          <option key={place_id} value={name}>
            {name}
          </option>
        ))}
      </Select>
    </section>
  );
};

export default SelectSchoolForm;
