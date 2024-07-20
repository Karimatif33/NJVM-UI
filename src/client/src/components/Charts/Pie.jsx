import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie'
import { useStateContext } from '../../context/ContextProvider';

const Pie = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const { user, currentMode, currentcolor } = useStateContext(); // Ensure this is correctly imported

  const fetchData = () => {
    axios
      .get(`https://njmc.horus.edu.eg/api/hue/portal/v1/uiTotalsData/${user}`)
      .then((response) => {
        const data = response.data;

        if (data.length > 0) {
          const firstItem = data[0];
          const { hours, neededHours } = firstItem;

          // Transform data for the pie chart
          const transformedData = [
            {
              id: 'Earned',
              label: 'Earned',
              value: hours,
            },
            {
              id: 'Needed',
              label: 'Needed',
              value: neededHours,
            },
          ];

          setChartData(transformedData);
        } else {
          console.error("Empty array in the response data");
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [user]);

console.log(currentMode)
  const isDarkMode = currentMode === "Dark"
  const textColor = isDarkMode ? '#ffffff' : '#1a1717';
  const tooltipBgColor = isDarkMode ? '#333333' : '#ffffff';
  const tooltipTextColor = isDarkMode ? '#ffffff' : '#000000';
  const customColors = [currentcolor, '#87bbf797', '#a9e8a099', '#f4766050', '#f1e15b'];
  return (
    <div className={"widHgMob w-[51vh] h-[50vh] dark:bg-gray-800 bg-white p-4 rounded-lg shadow-md"}>
      <ResponsivePie
        data={chartData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={4}
        sortByValue={true}
        activeOuterRadiusOffset={8}
        colors={customColors}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        enableArcLinkLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={textColor}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        // arcLabel={e=>e.id+" ("+e.value+")"}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={textColor}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: textColor,
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                },
              },
            ],
          },
        ]}
        theme={{
          labels: {
            text: {
              fill: textColor,
            },
          },
          legends: {
            text: {
              fill: textColor,
            },
          },
          tooltip: {
            container: {
              background: tooltipBgColor,
              color: tooltipTextColor,
            },
          },
        }}
      />
    </div>
  );
}

export default Pie;