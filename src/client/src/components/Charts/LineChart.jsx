import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsiveBar } from '@nivo/bar';
import { useStateContext } from '../../context/ContextProvider';

const LineChart = () => {
  const [chartData, setChartData] = useState([]);
  const { currentMode, DBUser, currentcolor } = useStateContext();

  const extractAcademicYear = (acadYearName) => {
    return acadYearName.split(': ')[1];
  };

  const removeSpecialCharacters = (semesterName) => {
    return semesterName.split('|')[1];
  };

  const fetchData = () => {
    axios
      .get(`https://njmc.horus.edu.eg/api/hue/portal/v1/Transcript/${DBUser}`)
      .then((response) => {
        const rawData = response.data;

        // Helper functions
        const extractAcademicYear = (acadYearName) => acadYearName.split(': ')[1];
        const removeSpecialCharacters = (semesterName) => semesterName.replace(/[^\w\s]/gi, '');

        // Group data by academic year and semester
        const groupedData = rawData.reduce((acc, item) => {
          const year = extractAcademicYear(item.AcadYearName);
          const semester = removeSpecialCharacters(item.SemesterName);

          if (!acc[year]) {
            acc[year] = [];
          }

          acc[year].push({
            semester,
            semesterhr: item.semesterhr,
          });

          return acc;
        }, {});

        // Format the grouped data
        const formattedData = Object.entries(groupedData).map(([year, semesters]) => ({
          academicYear: year,
          ...semesters.reduce((acc, { semester, semesterhr }) => {
            acc[semester] = semesterhr;
            return acc;
          }, {}),
        }));

        // Sort the formatted data by academic year
        formattedData.sort((a, b) => (a.academicYear < b.academicYear ? -1 : 1));

        setChartData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [DBUser]);

  const isDarkMode = currentMode === 'Dark';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const customColors = ['#388ef196',currentcolor,  '#7be7f5b7', '#f4766050', '#f1e15b'];

  return (
    <div className={`widHgMob w-[51vh] h-[50vh] ${bgColor} rounded-lg shadow-md`}>
    
      <ResponsiveBar
        data={chartData}
        keys={Array.from(new Set(chartData.flatMap((d) => Object.keys(d).filter((key) => key !== 'academicYear'))))}
        indexBy="academicYear"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.15}
        groupMode="grouped"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={customColors}
        defs={[
          {
            id: 'dots',
            background: 'inherit',
            color: '#126aee',
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: 'lines',
            background: 'inherit',
            color: '#126aee',
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {

            match: {
              id: 'semesterhr',
            },
            id: 'dots',
          },
        ]}
        borderRadius={2}
        borderColor={{
          from: 'color',
          modifiers: [['darker', '1.6']],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Academic Year',
          legendPosition: 'middle',
          legendOffset: 32,
          tickColor: isDarkMode ? '#ffffff' : '#1a1717',
          legendTextColor: isDarkMode ? '#ffffff' : '#1a1717',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Hours',
          legendPosition: 'middle',
          legendOffset: -40,
          tickColor: isDarkMode ? '#ffffff' : '#1a1717',
          legendTextColor: isDarkMode ? '#ffffff' : '#1a1717',
        }}
        enableGridX={true}
        labelSkipWidth={12}
        labelSkipHeight={10}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', '1.5']],
        }}
        tooltip={({ id, value }) => (
          <div
            style={{
              backgroundColor: isDarkMode ? '#333333' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#000000',
              padding: '5px 10px',
              borderRadius: '4px',
            }}
          >
            {id === 'semesterhr' ? 'Hours' : id}: {value}
          </div>
        )}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in semester: ${e.indexValue}`}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: isDarkMode ? '#ffffff' : '#1a1717',
              },
            },
            legend: {
              text: {
                fill: isDarkMode ? '#ffffff' : '#1a1717',
              },
            },
          },
          labels: {
            text: {
              fill: isDarkMode ? '#ffffff' : '#1a1717',
            },
          },
          legends: {
            text: {
              fill: isDarkMode ? '#ffffff' : '#1a1717',
            },
          },
          tooltip: {
            container: {
              background: isDarkMode ? '#333333' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#000000',
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart; 