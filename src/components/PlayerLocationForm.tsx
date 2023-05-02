import React, { useEffect } from "react";
// import { fetchLocations } from "~/utils/locations/fetchLocations";

const PlayerLocationForm = () => {
  useEffect(() => {
    // const locations = fetchLocations().then();
  }, []);

  return (
    <>
      <div>
        <label htmlFor="location">Location: </label>
        <select name="location" id="location">
          <option value=""></option>
        </select>
      </div>
      <div>
        <label htmlFor="school">School: </label>
        <select name="school" id="school">
          <option value=""></option>
        </select>
      </div>
    </>
  );
};

export default PlayerLocationForm;
