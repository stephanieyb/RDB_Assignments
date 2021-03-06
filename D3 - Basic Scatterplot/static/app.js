var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG Wrapper - appends SVG group and holds chart
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltip
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("census_data.csv", function(err, censusdata) {
  if (err) throw err;

  censusdata.forEach(function(data) {
    data.uninsured = +data.uninsured;
    data.skippedvisits = +data.yes;
  });


  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([0, d3.max(censusdata, function(data) {
    return +data.uninsured;
  })]);
  yLinearScale.domain([0, d3.max(censusdata, function(data) {
    return +data.skippedvisits * 1.2;
  })]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      var state = data.state;
      var uninsured = +data.uninsured;
      var skippedvisits = +data.skippedvisits;
      return (state + "<br> Uninsured: " + uninsured + "% <br> Skipped Visits: " + skippedvisits +"%");
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(censusdata)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        // console.log(data.uninsured);
        return xLinearScale(data.uninsured);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.skippedvisits);
      })
      .attr("r", "12")
      .style("opacity", ".8")
      .attr("fill", "grey")
      .style("stroke-width", ".2")
      .on("click", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Health Care Engagement");

// Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Uninsured %");


    
    });



