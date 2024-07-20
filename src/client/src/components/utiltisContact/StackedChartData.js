let stackedChartData = [];

fetch("https://njmc.horus.edu.eg/api/hue/portal/v1/Semesters/7879")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    stackedChartData = data.map((semester) => ({
      x: semester.SemsterName,
      y: semester.semesterhr,
    }));

    console.log(stackedChartData);

    // Now you can use stackedChartData as needed

    // Define stackedCustomSeries within the then block
    const stackedCustomSeries = [
      {
        dataSource: stackedChartData,
        xName: "x",
        yName: "y",
        name: "EH",
        type: "StackingColumn",
        background: "blue",
      },
    ];

    // Export stackedCustomSeries
    module.exports.stackedCustomSeries = stackedCustomSeries;
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

module.exports.stackedPrimaryXAxis = {
  majorGridLines: { width: 0 },
  minorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  interval: 1,
  lineStyle: { width: 0 },
  labelIntersectAction: "Rotate45",
  valueType: "Category",
};

module.exports.stackedPrimaryYAxis = {
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
