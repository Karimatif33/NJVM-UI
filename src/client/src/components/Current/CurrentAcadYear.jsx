import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import Axios if you're using it

const CurrentAcadYear = () => {
  const [data, setData] = useState([]);
  const [CurAcadYear, setCurAcadYear] = useState([]);
  const [selectedAcadYearValue, setSelectedAcadYearValue] = useState("");
  const [selectedAcadYearName, setSelectedAcadYearName] = useState("");
  const acadYearElementRef = useRef(null);
  useEffect(() => {
    fetchData();
    CurrentAcadYear();
  }, []);

  useEffect(() => {
    const selectedItem = data.find((item) => item.id === selectedAcadYearValue);
    if (selectedItem) {
      acadYearElementRef.current.textContent = `Current: ${selectedItem.name}`;
    }
  }, [selectedAcadYearValue, data]);

  const fetchData = () => {
    axios
      .get("https://njmc.horus.edu.eg/api/hue/portal/v1/acad-year")
      .then((response) => {
        console.log("GET request successful");
        setData(response.data);
        console.log({ data });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const CurrentAcadYear = () => {
    // Fetch additional data from another API endpoint
    axios
      .get("https://njmc.horus.edu.eg/api/hue/portal/v1/current")
      .then((response) => {
        console.log("GET request for additional data successful");
        setCurAcadYear(response.data);

        console.log(CurAcadYear.selectedacadyearName, "a");
        // Process additional data here
      })
      .catch((error) => {
        console.error("Error fetching additional data:", error);
        // Handle error
      });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedAcadYearValue(value);
    const numericValue = parseInt(value, 10); // Base 10

    console.log(value);
    if (!isNaN(numericValue)) {
      setSelectedAcadYearValue(numericValue);
      const selectedYear = data.find((item) => item.id === numericValue);
      if (selectedYear) {
        setSelectedAcadYearName(selectedYear.name);
        console.log(selectedAcadYearValue, selectedAcadYearName);
        // Send POST request with selected value
        axios
          .post("https://njmc.horus.edu.eg/api/hue/portal/v1/CurAcad_yearValue", {
            selectedAcadYearValue: numericValue,
            selectedAcadYearName: selectedYear.name,
          })
          .then((response) => {
            console.log("POST request successful");
          })
          .catch((error) => {
            console.error("Error sending POST request:", error);
          });
      }
    } else {
      console.error("Invalid input: Input is not a number");
    }
  };

  return (
    <div>
      <label
        htmlFor="dropdown"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Select Academic Year:
      </label>
      <select
        id="dropdown"
        value={selectedAcadYearValue}
        onChange={handleChange}
        className="block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option disabled selected value="">
          {CurAcadYear?.selectedacadyearName}
        </option>
        {data
          .sort((b, a) => a.name.localeCompare(b.name)) // Sort the data array alphabetically by the name property
          .map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
      </select>
      {selectedAcadYearValue ? (
        <p
          className="text-green-500 font-black mt-1"
          ref={acadYearElementRef}
          id="currentAcadYear"
        ></p>
      ) : (
        <p className="text-green-500 font-black mt-1" id="currentAcadYear">
          {" "}
          Current : {CurAcadYear?.selectedacadyearName}
        </p>
      )}
    </div>
  );
};

export default CurrentAcadYear;
