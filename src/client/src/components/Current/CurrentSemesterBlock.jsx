import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import Axios if you're using it

const CurrentSemesterBlock = () => {
  const [data, setData] = useState([]);
  const [selectedSemesterValue, setSelectedSemesterValue] = useState("");
  const [CurSemester, setCurSemester] = useState([]);
  const [selectedSemesterName, setSelectedSemesterName] = useState("");
  const SemesterElementRef = useRef(null);
  useEffect(() => {
    fetchData();
    CurrentSemester();
  }, []);

  useEffect(() => {
    const selectedItem = data.find((item) => item.id === selectedSemesterValue);
    if (selectedItem) {
      SemesterElementRef.current.textContent = `Current: ${selectedItem.name}`;
    }
  }, [selectedSemesterValue, data]);

  const fetchData = () => {
    // Fetch data from API endpoint
    axios
      .get("https://njmc.horus.edu.eg/api/hue/portal/v1/semester-data")
      .then((response) => {
        console.log("GET request successful");
        setData(response.data);
        console.log({ data });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error
      });
  };

  const CurrentSemester = () => {
    // Fetch additional data from another API endpoint
    axios
      .get("https://njmc.horus.edu.eg/api/hue/portal/v1/BlockTime")
      .then((response) => {
        console.log("GET request for additional data successful");
        setCurSemester(response.data);

        console.log(CurSemester.selectedSemesterName, "a");
        // Process additional data here
      })
      .catch((error) => {
        console.error("Error fetching additional data:", error);
        // Handle error
      });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedSemesterValue(value);
    const numericValue = parseInt(value, 10); // Base 10

    console.log(value);
    if (!isNaN(numericValue)) {
      setSelectedSemesterValue(numericValue);
      const selectedSem = data.find((item) => item.id === numericValue);
      if (selectedSem) {
        setSelectedSemesterName(selectedSem.name);
        console.log(selectedSemesterValue, selectedSemesterName);
        // Send POST request with selected value
        axios
          .post("https://njmc.horus.edu.eg/api/hue/portal/v1/CurSemesterBlock_val", {
            selectedSemesterValue: numericValue,
            selectedSemesterName: selectedSem.name,
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
        Select Semester:
      </label>
      <select
        id="dropdown"
        value={selectedSemesterValue}
        onChange={handleChange}
        className="block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="" selected disabled>{CurSemester?.selectedSemesterName}</option>
        {data.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      {selectedSemesterValue ? (
        <p className="text-green-500 font-black mt-1" ref={SemesterElementRef} id="currentAcadYear"></p>
      ) : (
        <p className="text-green-500 font-black mt-1" id="currentAcadYear">
          {" "}
          Current : {CurSemester?.selectedSemesterName}
        </p>
      )}
    </div>
  );
};

export default CurrentSemesterBlock;
