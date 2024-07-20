import React, { useEffect, useState } from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, StackingColumnSeries, Tooltip } from '@syncfusion/ej2-react-charts';
import { useStateContext } from '../../context/ContextProvider';

const Stacked = ({ width, height }) => {
  const { currentMode } = useStateContext();
  const [stackedCustomSeries, setStackedCustomSeries] = useState([]);

  const extractAcademicYear = (academicYear) => {
    return academicYear.replace("Academic Year: ", "");
  };
  useEffect(() => {
    fetch("https://njmc.horus.edu.eg/api/hue/portal/v1/Semesters/7879")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const stackedChartData = data.map((semester) => ({
          x: semester.SemsterName,
          y: semester.semesterhr,
        }));

        console.log(stackedChartData[0]);

        const customSeries = data.map((semester) => ({
          dataSource: [{ x: semester.SemsterName, y: semester.semesterhr }], // Each data point as a separate data source
          xName: "x",
          yName: "y",
          name: `${semester.SemsterName}`, // Unique name for each series
          type: "Column",
          background: "blue", // Or any other color you prefer
        }));

        setStackedCustomSeries(customSeries);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  return (
    <ChartComponent
      id="charts"
      primaryXAxis={stackedPrimaryXAxis}
      primaryYAxis={stackedPrimaryYAxis}
      width={width}
      height={height}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      legendSettings={{ background: 'white' }}
    >
      <Inject services={[StackingColumnSeries, Category, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {stackedCustomSeries.map((item, index) => (
          <SeriesDirective key={index} {...item} />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default Stacked;

export const stackedPrimaryXAxis = {
  majorGridLines: { width: 0 },
  minorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  interval: 1,
  lineStyle: { width: 0 },
  labelIntersectAction: "Rotate45",
  valueType: "Category",
};

export const stackedPrimaryYAxis = {
  lineStyle: { width: 0 },
  minimum: 0,
  maximum: 25,
  interval: 5,
  majorTickLines: { width: 0 },
  majorGridLines: { width: 1 },
  minorGridLines: { width: 1 },
  minorTickLines: { width: 0 },
  labelFormat: "{value}",
};
