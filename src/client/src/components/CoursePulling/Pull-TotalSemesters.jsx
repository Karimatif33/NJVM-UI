import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ButtonType from "../ButtonType";

const PullTotalSemesters = () => {
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = `https://njmc.horus.edu.eg/api/hue/portal/v1/student-semesters/${courseId}`;

  const handleInputChange = (event) => {
    setCourseId(event.target.value);
  };

  const handlePullData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} Error fetching data from "${apiUrl}"`
        );
      }

      setStatus("Success");
      toast.success(" Success!");
      setIsLoading(false);
    } catch (error) {
      console.error(error.message, "Error fetching data:");
      setStatus("Failed");
      setIsLoading(false);
      setError(error.message);
      toast.error(error.message);

      // Clear the error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 7000);
    }
  };

  useEffect(() => {
    // Reset the status when input value changes
    setStatus(null);
  }, [courseId]);

  return (
    <div className="flex-wrap justify-center items-baseline flex">
      <label className="block text-gray-700 mt-4  dark:text-white">
        Total Semesters
        <input
          id="studentId"
          className="border border-black rounded-md p-4 mt-1 ml-4 dark:text-black"
          type="number"
          value={courseId}
          onChange={handleInputChange}
          placeholder="Enter Course ID"
        />
      </label>

      <ButtonType onClick={handlePullData} className="btn-primary" type="button"  disabled={isLoading || !courseId} isLoading={isLoading} status={status}>
    {isLoading ? "Loading..." : status ? status : "Pull"}
    </ButtonType>
      <div className="max-w-24 max-h-20">
        {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
      </div>
    </div>
  );
};

export default PullTotalSemesters;
