import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { api } from "~/utils/api";
import { useState } from "react";
import "@reach/combobox/styles.css";

const AutoCompleteForm = ({ email }: { email: string }) => {
  const [location, setLocation] = useState("");
  const [school, setSchool] = useState("");

  const newLocationAndSchool =
    api.player.updatePlayerSchoolAndLocation.useMutation();

  // const handleLocationSchoolFormSubmit = (evt: React.FormEvent) => {
  //   evt.preventDefault();
  //   const formData = new FormData(evt.target as HTMLFormElement);
  //   const formValues = Object.fromEntries(formData.entries());
  //   const { locationInput: selectedLocation, schoolInput: selectedSchool } =
  //     formValues;

  //   setLocation(selectedLocation as string);
  //   setSchool(selectedSchool as string);

  //   newLocationAndSchool.mutate({
  //     email: email,
  //     location: location,
  //     school: school,
  //   });

  //   const form = evt.target as HTMLFormElement;
  //   form.reset();
  // };

  return (
    <>
      <LocationInput />
      <SchoolInput selectedLocation={location} />
    </>
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

export default AutoCompleteForm;
