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


// read csv data and store on a variable
d3.csv("/assets/data/data.csv").then(function(newsData) {
    
  newsData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.income = +data.income;
    data.poverty = +data.poverty;
  });


  // xscale function
  let xLinearScale = d3.scaleLinear()
      .domain([d3.min(newsData, d=>d.obesity)*0.8, 
          d3.max(newsData, d => d.obesity)*1.2])
      .range([0, width]);

  // yscale function
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

  // append circles to svg
  const circlesGroup = chartGroup.selectAll("circle")
      .data(newsData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.obesity))
      .attr("cy", d => yLinearScale(d.income))
      .attr("r", 12)
      .attr("fill", "blue")
      .attr("opacity", ".2");

  // add abbr to circles
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
      .attr("font-size","10px");


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




  // initialize Tooltip
  const toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0, 0])
    .html(function(d) {
      return (`<strong>${d.state}</strong>
      <br>
      <br>Income: ${d.income}
      <br> Obesity: ${d.obesity}
      <br> Poverty: ${d.poverty}`);
    });

  // add tooltip to chartGroup
  chartGroup.call(toolTip);   

  // add "mouseover" event listener to  tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
  // add "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d);
      });

})