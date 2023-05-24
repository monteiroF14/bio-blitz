import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "@reach/combobox/styles.css";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

const AutoCompleteForm = () => {
  const [location, setLocation] = useState("");

  return (
    <>
      <LocationInput setLocation={setLocation} />
      <SchoolInput />
    </>
  );
};

const LocationInput = ({
  setLocation,
}: {
  setLocation: Dispatch<SetStateAction<string>>;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)"],
    },
  });

  const handleSelect = (address: string) => {
    setValue(address, false);
    setLocation(address);
    clearSuggestions();
  };

  return (
    <section>
      <label
        htmlFor="locationInput"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Enter a location:
      </label>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          id="locationInput"
          name="locationInput"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          required
          placeholder="Search a location.."
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </section>
  );
};

const SchoolInput = () => {
  const options = {
    key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  };

  const API_URL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?query=school&key=${options.key}`;

  const schoolsQuery = api.player.getSchoolsByLocation.useQuery(API_URL);

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
        <option value="ESMAD">
          Escola Superior de Media Artes e Design - Politécnico do Porto
        </option>
      </select>
    </section>
  );
};

export default AutoCompleteForm;
