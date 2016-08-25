var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var gdpData = [];
var modifiedData = [];
$.ajax({
	url: url,
	dataType: "json",
	success: function(data) {
		for (var point in data.data) {	
			gdpData.push(data.data[point]);
		};
		console.log(gdpData[0]);
		for (var point in gdpData) {
			var fullDate = gdpData[point][0];
			fullDate = fullDate.split("-");
			modifiedData.push([fullDate[0], gdpData[point][1]]);
		}
		plot();
	},
	error: function () {
		alert("Data couldn't be retreived.");
	}
});	

// should be a function called from ajax, if not in function. it'll execute before the response comes back and nothing will be displayed.
function plot() {
	var padding = 100;
	var width = 1000;
	var height = 600;
	var chart = d3.select("body").append("svg").attr("height", height).attr("width", width);
	chart.style("background-color", "white");

	var xScale = d3.scale.linear()
						.domain([0, d3.max(modifiedData, function(d) {return d[0];})])
						.range([padding, width - padding / 2]);

	var yScale = d3.scale.linear()
						.domain([0, d3.max(modifiedData, function(d) {return d[1];})])
						.range([height - padding, padding]);
	var colorScale = d3.scale.linear()
						.domain([d3.min(modifiedData, function(d) {return d[1];}), d3.max(modifiedData, function(d) {return d[1];})])
						.range([0, 256]);

	chart.selectAll("rect")
		.data(modifiedData)
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
			// we have full padding from left and half padding from right.. totalis 1.5.
			return ((width - 1.5*padding)/ modifiedData.length) * i + padding;
		})
		.attr("y", function(d) {
			return yScale(d[1]);
		})
		.attr("width", function(d) {
			// +1 here makes the bars overlap and hide the borders between them
			return (width-padding) / modifiedData.length + 1;
		})
		.attr("height", function(d) {
			return height - yScale(d[1]) - padding;
		})
		.attr("fill", function(d) {
			// Math.floor in needed, rgb only accepts integers.
			return "rgb(0,0," + Math.floor(colorScale(d[1])) + ")";
		});
	var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom");
	chart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0, "+ (height - padding) +" )")
		.style("stroke-width", "3px")
		.call(xAxis);
	var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left");
	chart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+padding+", 0)")
		.call(yAxis);

	chart.append("text")
		.attr("x", width / 2)
		.attr("y", padding / 2)
		.text("Gross Domestic Product in the U.S (1947 - 2015)")
		.attr("text-anchor", "middle")
		.attr("font-family", "arial")
		.attr("fill", "gray")
		.attr("font-size", "1.5em");

	chart.append("text")
		.attr("x", width / 2)
		.attr("y", height - padding / 2)
		.text("Year")
		.attr("text-anchor", "middle")
		.attr("font-family", "arial")
		.attr("fill", "gray")
		.attr("font-size", "1em");

	chart.append("text")
		.attr("x", width / 2)
		.attr("y", height - padding / 4)
		.text("Source: Federal Reserve Economic Data")
		.attr("text-anchor", "middle")
		.attr("font-family", "arial")
		.attr("fill", "gray")
		.attr("font-size", "0.8em");

	// since text is rotated, x becomes y and vice versa (it seems that center of rotation is point (0,0))
	chart.append("text")
		.attr("x", -height / 2)
		.attr("y", padding / 3)
		.text("Gross Demostic Product ($Billion)")
		.attr("text-anchor", "middle")
		.attr("font-family", "arial")
		.attr("fill", "gray")
		.attr("font-size", "1em")
		.attr("transform", "rotate(-90)");
}
