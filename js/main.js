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
		for (var point in gdpData) {
			var fullDate = gdpData[point][0];
			fullDate = fullDate.split("-");
			var year = fullDate[0];
			var value = gdpData[point][1];
			var monthNumber = fullDate[1];
			if (monthNumber == "01") {
				var month = "January";
			} else if (monthNumber == "04") {
				var month = "April";
			} else if (monthNumber == "07") {
				var month = "July";
			} else if (monthNumber == "10") {
				var month = "October";
			} else {
				var month = "Unknown";
			}
			modifiedData.push([year, value, month]);
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
	var chart = d3.select("#chart-area").append("svg").attr("height", height).attr("width", width);
	chart.style("background-color", "white");

	var xScale = d3.scale.linear()
						.domain([d3.min(modifiedData, function(d) {return d[0];}), d3.max(modifiedData, function(d) {return d[0];})])
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
			return "rgb(200,60," + Math.floor(colorScale(d[1])) + ")";
		})
		.attr("value", function(d) {
			return d[1];
		})
		.attr("year", function(d) {
			return d[0];
		})
		.attr("month", function(d) {
			return d[2];
		});
	var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(12);
	chart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0, "+ (height - padding) +" )")
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
	$("rect").hover(function(e) {
		$(this).attr("fill", "green");
		var xPosition = e.pageX - $("svg").offset().left - 50;
		var yPosition = e.pageY - $("svg").offset().top - 60;
		chart.append("rect")
			.attr("x", xPosition - 10)
			.attr("y", yPosition)
			.attr("width", 120)
			.attr("height", 60)
			.attr("rx", 20)
			.attr("ry", 20)
			.attr("fill", "rgba(174, 156, 60, 0.8)")
			.attr("id", "infoWindow");
		chart.append("text")
			.attr("x", xPosition + 50)
			.attr("y", yPosition + 25)
			.attr("fill", "white")
			.attr("font-size", "0.8em")
			.attr("font-family", "arial")
			.attr("class", "infoText")
			.attr("text-anchor", "middle")
			.text("$" + $(this).attr('value') + " Billion");

		chart.append("text")
			.attr("x", xPosition + 50)
			.attr("y", yPosition + 45)
			.attr("fill", "white")
			.attr("font-size", "0.8em")
			.attr("font-family", "arial")
			.attr("class", "infoText")
			.attr("text-anchor", "middle")
			.text($(this).attr('month') + "-" + $(this).attr('year'));

		}, function() {
			$(this).attr("fill", "rgb(200,60," + Math.floor(colorScale($(this).attr('value'))) + ")");
			d3.select("#infoWindow").remove();
			d3.selectAll(".infoText").remove();
		});
}
