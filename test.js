const data = [25, 30, 45, 60, 20];
const width = 500;
const height = 100;

// 1. Create the SVG canvas
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// 2. Bind data and create rectangles
svg.selectAll("rect")
  .data(data)
  .join("rect") // This creates a 'rect' for each item in the array
  .attr("x", (d, i) => i * 70) // Spread bars horizontally
  .attr("y", d => height - d)  // Position based on value
  .attr("width", 65)
  .attr("height", d => d)      // Height reflects the data value
  .attr("fill", "steelblue");
  

