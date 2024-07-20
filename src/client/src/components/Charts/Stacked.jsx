import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";

const Stacked = () => {
  const [data, setData] = useState([]);
  const { DBUser, currentcolor } = useStateContext();

  const extractAcademicYear = (academicYear) => {
    return academicYear.replace("Academic Year: ", "");
  };

  function removeSpecialCharacters(inputString) {
    const regex = /[^a-zA-Z0-9\s]/g;
    return inputString.replace(regex, "");
  }

  const fetchData = () => {
    axios
      .get(`https://njmc.horus.edu.eg/api/hue/portal/v1/Transcript/${DBUser}`)
      .then((response) => {
        const modifiedData = response.data.map((semester) => ({
          AcademicYear: extractAcademicYear(semester.AcadYearName),
          SemesterName: removeSpecialCharacters(semester.SemesterName),
          semesterhr: semester.semesterhr,
        }));
        modifiedData.sort((a, b) => {
          if (a.AcademicYear < b.AcademicYear) return -1;
          if (a.AcademicYear > b.AcademicYear) return 1;
          return 0;
        });
        setData(modifiedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data at regular intervals
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="AcademicYear" />
          <YAxis />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="semesterhr" fill={currentcolor} maxBarSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p className="text-center dark:text-black">
          {`${payload[0].payload.SemesterName} - ${payload[0].payload.AcademicYear} `}{" "}
          <br />
          <span className="text-center">{`EH - ${payload[0].payload.semesterhr}`}</span>{" "}
        </p>
      </div>
    );
  }

  return null;
};

export default Stacked;
