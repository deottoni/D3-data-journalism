// @TODO: YOUR CODE HERE!
const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);



// Append an SVG group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// const newsData = d3.csv("assets/data/data.csv");
// console.log(newsData)





d3.csv("/assets/data/data.csv").then(function(newsData) {
    
  newsData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.income = +data.income;
    data.poverty = +data.poverty;
  });


  // set xscale function
  let xLinearScale = d3.scaleLinear()
      .domain([d3.min(newsData, d=>d.obesity)*0.8, 
          d3.max(newsData, d => d.obesity)*1.2])
      .range([0, width]);

  // set yscale function
  let yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(newsData, d => d.income)*1.2])
      .range([height, 0]);

  // axes
  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .style("font-size", "18px")
      .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
      .style("font-size", "18px")
      .call(leftAxis);

  // append circles to svg element
  chartGroup.selectAll("circle")
      .data(newsData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.obesity))
      .attr("cy", d => yLinearScale(d.income))
      .attr("r", 15)
      .attr("fill", "blue")
      .attr("opacity", ".2");

  // add state abbreviations to circles
  chartGroup.selectAll("text.text-circles")
      .data(newsData)
      .enter()
      .append("text")
      .classed("text-circles",true)
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d.obesity))
      .attr("y", d => yLinearScale(d.income))
      .attr("dy",5)
      .attr("text-anchor","middle")
      .attr("font-size","12px");


  // x axis
  chartGroup.append("text")
    .attr("y", height + margin.bottom/2 - 10)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Obesity Rate (%)");

  // y axis
  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("aText", true)
      .text("Income Rate (%)");



// // gridlines in x axis function
// function make_x_gridlines() {		
//   return d3.axisBottom(xLinearScale)
//       .ticks(5)
// }

// // gridlines in y axis function
// function make_y_gridlines() {		
//   return d3.axisLeft(yLinearScale)
//       .ticks(5)
// }
//   // add the X gridlines
//   svg.append("g")			
//   .attr("class", "grid")
//   .attr("transform", `translate(0, ${height})`)
//   .call(make_x_gridlines()
//       .tickSize(-height)
//       .tickFormat("")
//   )

// // add the Y gridlines
// svg.append("g")			
//   .attr("class", "grid")
//   .call(make_y_gridlines()
//       .tickSize(-width)
//       .tickFormat("")
//   )


});