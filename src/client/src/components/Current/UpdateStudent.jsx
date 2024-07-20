import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import Axios if you're using it

const UpdateStudent = () => {
  const [data, setData] = useState([]);
  const [isChecked, setIsChecked] = useState();
  const [CurUpdateStudent, setCurUpdateStudent] = useState([]);
  const [selectedUpdateStudentValue, setSelectedUpdateStudentValue] = useState("");
  const [selectedUpdateStudentName, setSelectedUpdateStudentName] = useState("");
  const UpdateStudentElementRef = useRef(null);
  useEffect(() => {
    // fetchData();
    UpdateStudent();
  }, []);

  // useEffect(() => {
  //   const selectedItem = data.find((item) => item.id === selectedUpdateStudentValue);
  //   if (selectedItem) {
  //     UpdateStudentElementRef.current.textContent = `Current: ${selectedItem.name}`;
  //   }
  // }, [selectedUpdateStudentValue, data]);

  // const fetchData = () => {
  //   axios
  //     .get("https://njmc.horus.edu.eg/api/hue/portal/v1/acad-year")
  //     .then((response) => {
  //       console.log("GET request successful");
  //       setData(response.data);
  //       console.log({ data });
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // };

  const UpdateStudent = () => {
    // Fetch additional data from another API endpoint
    axios
      .get("https://njmc.horus.edu.eg/api/hue/portal/v1/current")
      .then((response) => {
        console.log("GET request for additional data successful");
        const idCurUpdateStudent = response.data.UpdateStudent;
        const isCheckedValue = idCurUpdateStudent === true ? true : false;
        setIsChecked(isCheckedValue);
        setCurUpdateStudent(response.data);
        console.log(response.data.UpdateStudent, "CurUpdateStuden1t"); 
        // Process additional data here
      })
      .catch((error) => {
        console.error("Error fetching additional data:", error);
        // Handle error
      });
  };
  




  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
  
    // Update the state of the checkbox
    setIsChecked(isChecked);
  
    // Determine the value to send based on the checkbox state
    const valueToSend = isChecked ? "true" : "false";
  
    // Send POST request with the valueToSend
    axios
      .post("https://njmc.horus.edu.eg/api/hue/portal/v1/UpdateStudent_val", {
        selectedCurrentValue: valueToSend,
      })
      .then((response) => {
        console.log("POST request successful");
      })
      .catch((error) => {
        console.error("Error sending POST request:", error);
      });
  };
  

  return (
   
    <div className="flex items-center">
    <input
      id="checked-checkbox"
      type="checkbox"
      checked={isChecked}
      onChange={handleCheckboxChange}
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
    />
    <label
      htmlFor="checked-checkbox"
      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
    >
      Update student data on login
    </label>
  </div>
  
  
    
  );
};

export default UpdateStudent;
