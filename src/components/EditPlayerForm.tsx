import { LoadScriptProps, useJsApiLoader } from "@react-google-maps/api";
import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import Loading from "./Loading";
import { useState } from "react";

const libraries: LoadScriptProps["libraries"] = ["places"];

const EditPlayerForm = ({ email }: { email: string }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) return <Loading />;
  return <AutoCompleteForm email={email} />;
};

const AutoCompleteForm = ({ email }: { email: string }) => {
  const [location, setLocation] = useState("");
  const [school, setSchool] = useState("");

  const newLocationAndSchool =
    api.player.updatePlayerSchoolAndLocation.useMutation();

  const handleLocationSchoolFormSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData.entries());
    const { locationInput: selectedLocation, schoolInput: selectedSchool } =
      formValues;

    setLocation(selectedLocation as string);
    setSchool(selectedSchool as string);

    newLocationAndSchool.mutate({
      email: email,
      location: location,
      school: school,
    });

    const form = evt.target as HTMLFormElement;
    form.reset();
  };

  return (
    <form
      className=" w-full space-y-8"
      onSubmit={handleLocationSchoolFormSubmit}
    >
      <LocationInput />
      {/* TODO: fazer o school input*/}
      {/*TODO: ver se dá pra juntar os loadings pra ficar tudo no profile.tsx */}
      <SchoolInput selectedLocation={location} />
      <button
        type="submit"
        className="w-1/3 rounded-lg bg-blue-700 p-2.5 px-12 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
};

const LocationInput = () => {
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

const SchoolInput = ({ selectedLocation }: { selectedLocation: string }) => {
  const request = {
    location: selectedLocation,
    radius: 500,
    type: ["secondary_school"],
  };

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
        // required
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      ></select>
    </section>
  );
};

export default EditPlayerForm;
