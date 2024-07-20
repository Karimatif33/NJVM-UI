import React, { useEffect, useState } from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  ColumnSeries,
  Legend,
  Category,
  Tooltip,
  DataLabel,
  LineSeries,
} from "@syncfusion/ej2-react-charts";
import { useStateContext } from "../../context/ContextProvider";

const Stacked = ({ width, height }) => {
  const { currentMode } = useStateContext();
  const [stackedCustomSeries, setStackedCustomSeries] = useState([]);
  const { DBUser } = useStateContext();

  const extractAcademicYear = (academicYear) => {
    return academicYear.replace("Academic Year: ", "");
  };
  useEffect(() => {
    // fetch(`https://njmc.horus.edu.eg/api/hue/portal/v1/Transcript/${DBUser}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const stackedChartData = data.map((semester) => ({
          x: semester.SemesterName,
          y: semester.semesterhr,
          s: semester.AcadYearName,
        }));

        // console.log(stackedChartData[0]);

        const customSeries = data.map((semester) => ({
          dataSource: [
            {
              x: extractAcademicYear(semester.AcadYearName),
              y: semester.semesterhr,
            },
          ], // Each data point as a separate data source
          xName: "x",
          yName: "y",
          name: `${semester.SemesterName}`, // Unique name for each series
          type: "Column",
          background: "blue", // Or any other color you prefer
        }));

        setStackedCustomSeries(customSeries);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const primaryxAxis = { valueType: "Category", title: "Semesters" };
  const primaryyAxis = {
    minimum: 0,
    maximum: 25,
    interval: 5,
    title: "Total Hours",
  };

  return (
    <ChartComponent
      id="charts"
      primaryXAxis={primaryxAxis}
      primaryYAxis={primaryyAxis}
      title="Semesters"
      // style={{ margin: '0 auto' }}
      width={width}
      height={height}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === "Dark" ? "#33373E" : "#fff"}
      legendSettings={{ background: "white" }}
    >
      <Inject
        services={[ColumnSeries, Tooltip, DataLabel, LineSeries, Category]}
      />
      <SeriesCollectionDirective>
        {stackedCustomSeries.map((series, index) => (
          <SeriesDirective
            key={index}
            dataSource={series.dataSource}
            xName={series.xName}
            yName={series.yName}
            name={series.name}
            type={series.type}
            columnMaxWidth={0.5}
          />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default Stacked;
