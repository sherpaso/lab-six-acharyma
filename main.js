
// input: selector for a chart container e.g., ".chart"
function AreaChart(container){

    // initialization
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    const graph = svg.append("g").classed(".chart-svg", true);

    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft().ticks(3).scale(yScale);

    const xAxisUp = svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
    .call(xAxis);

    const yAxisUp = svg
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(yAxis);

    const path = graph.append("path");

    var area = d3
    .area()
    .x((d) => xScale(d.date) + margin.left)
    .y0(yScale(0) + margin.top)
    .y1((d) => yScale(d.total) + margin.top);

	function update(data){ 
        console.log(data.map((d) => d.total))

        // update scales, encodings, axes (use the total count)
        xScale.domain(d3.extent(data.map((d) => d.date)));
        yScale.domain([0, d3.max(data, (d) => d.total)]);

        xAxisUp.call(xAxis);
        yAxisUp.call(yAxis);

        path.datum(data).attr("fill", "orange").attr("d", area);
	}

	return {
		update // ES6 shorthand for "update": update
	};
}

d3.csv('unemployment.csv', d3.autoType).then(data=>{
    console.log(data);

    data.map(
        (d) =>
          (d.total = Object.values(d)
            .slice(1)
            .reduce((a, b) => a + b, 0))
    );

    const areaChart1 = AreaChart(".chart-container1");
    areaChart1.update(data);

    // const areaChart2 = AreaChart(".chart-container2");

    // areaChart2.update(data);
    

});