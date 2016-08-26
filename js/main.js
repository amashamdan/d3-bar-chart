/* The url has the data to be plotted in the bar chart. */
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
/* This variable will store the raw data retreived by AJAX. */
var gdpData = [];
/* Tis variable will store data extracted from gdpData... only needed data will be extracted from gdpData. */
var modifiedData = [];
/* Ajax request to fetch the data */
$.ajax({
	url: url,
	dataType: "json",
	success: function(data) {
		/* The information about quarterly gdp are pushed to gdpData. */
		for (var point in data.data) {	
			gdpData.push(data.data[point]);
		};
		for (var point in gdpData) {
			/* Date infomration in gdpData are in arrays, each one has a date in index 0 formatted as: yyyy-mm-dd. We need month and year so the string is split and the resulting array is stored into full date. */
			var fullDate = gdpData[point][0];
			fullDate = fullDate.split("-");
			/* year is copied from fullDate to the variable year. */
			var year = fullDate[0];
			/* gdp value is copied directly from gdpData. */
			var value = gdpData[point][1];
			/* Month number is stored and the if statement stores the corresponding month in the month variable. */
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
			/* Extracted data are stored in modifiedData. */
			modifiedData.push([year, value, month]);
		}
		/* The function plot is called to create the bar chart. */
		plot();
	},
	/* If no data are received a message is alerted to the user. */
	error: function () {
		alert("Data couldn't be retreived.");
	}
});	

// Should be a function called from ajax. If not in function, it'll execute before the response comes back and nothing will be displayed.
function plot() {
	var padding = 100;
	var width = 1000;
	var height = 600;
	/* Chart is declared an given a white background. */
	var chart = d3.select("#chart-area").append("svg").attr("height", height).attr("width", width);
	chart.style("background-color", "white");

	/* xScale, the domain starts from the earliest year and ends at the most recent year. */
	var xScale = d3.scale.linear()
						.domain([d3.min(modifiedData, function(d) {return d[0];}), d3.max(modifiedData, function(d) {return d[0];})])
						.range([padding, width - padding / 2]);

	/* yScale, domain from zero tp max. Range is flipped so the Y axis gets labeled with numbers properly. */
	var yScale = d3.scale.linear()
						.domain([0, d3.max(modifiedData, function(d) {return d[1];})])
						.range([height - padding, padding]);
	
    /* A scale created for colors to convert the gdp value to a value between 0 and 255 which is accepted by rgb. */
	var colorScale = d3.scale.linear()
						.domain([d3.min(modifiedData, function(d) {return d[1];}), d3.max(modifiedData, function(d) {return d[1];})])
						.range([0, 256]);

	/* Bars a re created here. */
	chart.selectAll("rect")
		.data(modifiedData)
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
			// we have full padding from left and half padding from right.. total is 1.5.
			return ((width - 1.5*padding)/ modifiedData.length) * i + padding;
		})
		/* Remeber, y= 0 is at the top, so we start drawing the bar from the top and then move down.. also remember scale is flipped. */
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
		/* The following three attributes are given to each bar. These information will be used to display information about each bar once it's hovered. You can assign any attribute you want to the bars. */
		.attr("value", function(d) {
			return d[1];
		})
		.attr("year", function(d) {
			return d[0];
		})
		.attr("month", function(d) {
			return d[2];
		});

	/* x axis is created and then appended. */
	var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(12);
	chart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0, "+ (height - padding) +" )")
		.call(xAxis);

	/* Y axis is created and appended. */
	var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left");
	chart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+padding+", 0)")
		.call(yAxis);

	/* The chart title s added. */
	chart.append("text")
		.attr("x", width / 2)
		.attr("y", padding / 2)
		.text("Gross Domestic Product in the U.S (1947 - 2015)")
		.attr("text-anchor", "middle")
		.attr("font-family", "arial")
		.attr("fill", "gray")
		.attr("font-size", "1.5em");

	/* The x-axis label is added. */
	chart.append("text")
		.attr("x", width / 2)
		.attr("y", height - padding / 2)
		.text("Year")
		.attr("text-anchor", "middle")
		.attr("font-family", "arial")
		.attr("fill", "gray")
		.attr("font-size", "1em");

	/* A note is added at the bottom of the chart. */
	chart.append("text")
		.attr("x", width / 2)
		.attr("y", height - padding / 4)
		.text("Source: Federal Reserve Economic Data")
		.attr("text-anchor", "middle")
		.attr("font-family", "arial")
		.attr("fill", "gray")
		.attr("font-size", "0.8em");

	// y-axis label is appended. Since text is rotated, x becomes y and vice versa (it seems that center of rotation is point (0,0))
	chart.append("text")
		.attr("x", -height / 2)
		.attr("y", padding / 3)
		.text("Gross Demostic Product ($Billion)")
		.attr("text-anchor", "middle")
		.attr("font-family", "arial")
		.attr("fill", "gray")
		.attr("font-size", "1em")
		.attr("transform", "rotate(-90)");

	/* The jQuery hover function is used to display and hide quarter's information once its bar is hovered and unhovered. */
	$("rect").hover(function(e) {
		/* Start with hover-over function.
		The hovered bar changes color to green. */
		$(this).attr("fill", "green");
		/* Poistion of the mouse is read and will be used to add an infoWindow above the pointer. */
		var xPosition = e.pageX - $("svg").offset().left - 50;
		var yPosition = e.pageY - $("svg").offset().top - 60;
		/* infoWindow is appended. rx and ry attributes gives the rectangle round corners. The rectangle is given an id. */
		chart.append("rect")
			.attr("x", xPosition - 10)
			.attr("y", yPosition)
			.attr("width", 120)
			.attr("height", 60)
			.attr("rx", 20)
			.attr("ry", 20)
			.attr("fill", "rgba(174, 156, 60, 0.8)")
			.attr("id", "infoWindow");
		/* Two lines of text are added after the rectangle (positioned to appear in the rectangle), the first line has the gdp in billions of dollars, the second line is the month and year. */
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
		/* The hover-out funtion. */
		}, function() {
			/* The old color is retrieved based on the value attribute, same as the color given when all bars were appended. */
			$(this).attr("fill", "rgb(200,60," + Math.floor(colorScale($(this).attr('value'))) + ")");
			/* infoWindow and the infoTexts are removed. */
			d3.select("#infoWindow").remove();
			d3.selectAll(".infoText").remove();
		});
}
