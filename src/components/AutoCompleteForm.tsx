import { env } from "~/env.mjs";
import { api } from "~/utils/api";

const AutoCompleteForm = () => {
  const options = {
    key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    query: "school",
  };

  const API_URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${options.query}&key=${options.key}`;

  const schoolsFromAPI = api.player.fetchSchools.useQuery({
    url: API_URL,
  }).data;

  return (
    <section>
      <label
        htmlFor="schoolsInput"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Select school:
      </label>
      <select
        name="schoolsInput"
        id="schoolsInput"
        defaultValue="ESMAD"
        required
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        {schoolsFromAPI?.map(({ place_id, name }) => (
          <option key={place_id} value={place_id}>
            {name}
          </option>
        ))}
      </select>
    </section>
  );
};

export default AutoCompleteForm;
