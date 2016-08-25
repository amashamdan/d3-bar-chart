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
	var width = 900;
	var height = 500;
	var padding = 0;
	var chart = d3.select("body").append("svg").attr("height", height).attr("width", width);
	chart.style("background-color", "white");

	var xScale = d3.scale.linear()
						.domain([0, d3.max(modifiedData, function(d) {return d[0];})])
						.range([padding, width - padding]);

	var yScale = d3.scale.linear()
						.domain([0, d3.max(modifiedData, function(d) {return d[1];})])
						.range([padding, height - padding]);

	chart.selectAll("rect")
		.data(modifiedData)
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
			return (width / modifiedData.length) * i;
		})
		.attr("y", function(d) {
			return height - yScale(d[1]);
		})
		.attr("width", function(d) {
			// +1 here makes the bars overlap and hide the borders between them
			return width / modifiedData.length + 1;
		})
		.attr("height", function(d) {
			return yScale(d[1]);
		})
		.attr("fill", "blue");
}
