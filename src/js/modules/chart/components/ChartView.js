import React from 'react';
import * as d3 from "d3"

class ChartView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
            stat: {},
            selectedYear: "1",
            candelColor: "green"
        };
    }

    componentDidMount () {
        const chartData = this.props.chartData
        this.drawChart(chartData)
    }

    componentDidUpdate(nextProps) {
        if (this.props.chartData === nextProps.chartData) {
            return false;
        }
        const chartData = this.props.chartData
        this.drawChart(chartData)
    }
    
    drawChart(data) {
        const w_data = []
        data.forEach(element => {
            const record = element.split(",")
            const singleRecord = {
                "Date": new Date(parseInt(record[0])),
                "Open": record[1],
                "High":record[2],
                "Low": record[3],
                "Close": record[4],
                "Volume": record[5]
            }

            w_data.push(singleRecord)
        });

        const months = {0 : 'Jan', 1 : 'Feb', 2 : 'Mar', 3 : 'Apr', 4 : 'May', 5 : 'Jun', 6 : 'Jul', 7 : 'Aug', 8 : 'Sep', 9 : 'Oct', 10 : 'Nov', 11 : 'Dec'}

        w_data.reverse()

        const margin = {top: 35, right: 65, bottom: 100, left: 50},
        w = window.innerWidth - margin.left - margin.right,
        h =  window.innerHeight - 100 - margin.top - margin.bottom;

        d3.select("#container").selectAll("g").remove()
        var svg = d3.select("#container")
                        .attr("width", w + margin.left + margin.right)
                        .attr("height", h + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" +margin.left+ "," +margin.top+ ")");

        let dates = w_data.map(data => (data.Date)).sort((a, b)=>{return a - b})
        
        var xmin = d3.min(w_data.map(r => r.Date));
        var xmax = d3.max(w_data.map(r => r.Date));
        var xScale = d3.scaleLinear().domain([-1, dates.length])
                        .range([0, w])
        var xDateScale = d3.scaleQuantize().domain([0, dates.length]).range(dates)
        let xBand = d3.scaleBand().domain(d3.range(-1, dates.length)).range([0, w]).padding(0.3)
        var xAxis = d3.axisBottom()
                        .scale(xScale)
                        .tickFormat(function(d) {
                            d = dates[d]
                            return d ? d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear(): ""
                        });

        var tooltipDiv = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
        
        svg.append("rect")
                    .attr("id","rect")
                    .attr("width", w)
                    .attr("height", h)
                    .style("fill", "none")
                    .style("pointer-events", "all")
                    .attr("clip-path", "url(#clip)")
        
        var gX = svg.append("g")
                    .attr("class", "axis x-axis") //Assign "axis" class
                    .attr("transform", "translate(0," + h + ")")
                    .call(xAxis)
        
        gX.selectAll(".tick text")
            .call(this.wrap, xBand.bandwidth()) 

        var ymin = Math.min(...w_data.map(r => r.Low));
        var ymax = Math.max(...w_data.map(r => r.High));
        var yScale = d3.scaleLinear().domain([ymin, ymax]).range([h, 0]).nice();
        var yAxis = d3.axisLeft()
                        .scale(yScale)
        
        var gY = svg.append("g")
                    .attr("class", "axis y-axis")
                    .call(yAxis);
        
        var chartBody = svg.append("g")
                    .attr("class", "chartBody")
                    .attr("clip-path", "url(#clip)");
        
        // draw rectangles
        let candles = chartBody.selectAll(".candle")
            .data(w_data)
            .enter()
            .append("rect")
            .attr('x', (d, i) => xScale(i) - xBand.bandwidth())
            .attr("class", "candle")
            .attr('y', d => yScale(Math.max(d.Open, d.Close)))
            .attr('width', xBand.bandwidth())
            .attr('height', d => (d.Open === d.Close) ? 1 : yScale(Math.min(d.Open, d.Close))-yScale(Math.max(d.Open, d.Close)))
            .attr("fill", d => (d.Open === d.Close) ? "silver" : (d.Open > d.Close) ? "red" : "green")
            .on("mouseover", (d, i) => {
                d.target.setAttribute("style","cursor:pointer;stroke:#000000")
                tooltipDiv.transition()		
                .duration(200)		
                .style("opacity", .9);		
                tooltipDiv.html("Date: " + (i.Date.getFullYear()+"-"+ i.Date.getDate()+"-"+months[i.Date.getMonth()]) + "<br/> Volume: "  + i.Volume)	
                .style("left", (d.pageX) + "px")		
                .style("top", (d.pageY - 28) + "px");	

                setTimeout(()=>{
                    tooltipDiv.transition()		
                    .duration(200)				
                    .style("opacity", 0);
                }, 1000)
                this.setState({stat: i})
                this.setState({candelColor: (i.Open > i.Close) ? "red" : "green"})		
            })
            .on("mouseout", (d, i) => {
                d.target.removeAttribute("style")
                /* tooltipDiv.transition()		
                .duration(200)		
                .style("opacity", 0);	 */
             })
            
        // draw high and low
        let stems = chartBody.selectAll("g.line")
            .data(w_data)
            .enter()
            .append("line")
            .attr("class", "stem")
            .attr("x1", (d, i) => xScale(i) - xBand.bandwidth()/2)
            .attr("x2", (d, i) => xScale(i) - xBand.bandwidth()/2)
            .attr("y1", d => yScale(d.High))
            .attr("y2", d => yScale(d.Low))
            .attr("stroke", d => (d.Open === d.Close) ? "white" : (d.Open > d.Close) ? "red" : "green");
        
        svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", w)
            .attr("height", h)
        
        const extent = [[0, 0], [w, h]];
        
        var resizeTimer;
        var zoom = d3.zoom()
            .scaleExtent([1, 100])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed)
            .on('zoom.end', zoomend);
        
        svg.call(zoom)

        function zoomed(event) {
			
			var t = event.transform;
			let xScaleZ = t.rescaleX(xScale);
			
			let hideTicksWithoutLabel = function() {
				d3.selectAll('.xAxis .tick text').each(function(d){
					if(this.innerHTML === '') {
					this.parentNode.style.display = 'none'
					}
				})
			}

			gX.call(
				d3.axisBottom(xScaleZ).tickFormat((d, e, target) => {
						if (d >= 0 && d <= dates.length-1) {
					d = dates[d]
					
					return  d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear()
					}
				})
			)

			candles.attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth()*t.k)/2)
				   .attr("width", xBand.bandwidth()*t.k);
			stems.attr("x1", (d, i) => xScaleZ(i) - xBand.bandwidth()/2 + xBand.bandwidth()*0.5);
			stems.attr("x2", (d, i) => xScaleZ(i) - xBand.bandwidth()/2 + xBand.bandwidth()*0.5);

			hideTicksWithoutLabel();
/* 
			gX.selectAll(".tick text")
			.call(this.wrap, xBand.bandwidth())  */

		}

		function zoomend(event) {
			var t = event.transform;
			let xScaleZ = t.rescaleX(xScale);
			clearTimeout(resizeTimer)
			resizeTimer = setTimeout(function() {

			var xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0]))),
				xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1]))),
				filtered = w_data.map(d => ((d.Date >= xmin) && (d.Date <= xmax))),
				minP = +d3.min(filtered, d => d.Low),
				maxP = +d3.max(filtered, d => d.High),
				buffer = Math.floor((maxP - minP) * 0.1)

			yScale.domain([minP - buffer, maxP + buffer])
			/* candles.transition()
				   .duration(800)
				   .attr("y", (d) => yScale(Math.max(d.Open, d.Close)))
				   .attr("height",  d => (d.Open === d.Close) ? 1 : yScale(Math.min(d.Open, d.Close))-yScale(Math.max(d.Open, d.Close)));
				   
			stems.transition().duration(800)
				 .attr("y1", (d) => yScale(d.High))
				 .attr("y2", (d) => yScale(d.Low)) */
			
			gY.transition().duration(800).call(d3.axisLeft().scale(yScale));

			}, 500)
			
		}
    }
    
    wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
    }

    onSubMenuClick (selectedValue, event) {
        this.props.updateChart(selectedValue)
        this.setState({selectedYear: selectedValue})
    }
    
	
	render() {
		return (
			<React.Fragment>
                <div className="chart_header">
                    <span className="chartHeaderAttr">Volume :</span>
                    <span className="chartHeaderValue" style={{color:this.state.candelColor}}>{this.state.stat.Volume}</span>
                    <span className="chartHeaderAttr">High :</span>
                    <span className="chartHeaderValue" style={{color:this.state.candelColor}}>{this.state.stat.High}</span>
                    <span className="chartHeaderAttr">Low :</span>
                    <span className="chartHeaderValue" style={{color:this.state.candelColor}}>{this.state.stat.Low}</span>
                    <span className="chartHeaderAttr">Open :</span>
                    <span className="chartHeaderValue" style={{color:this.state.candelColor}}>{this.state.stat.Open}</span>
                    <span className="chartHeaderAttr">Close :</span>
                    <span className="chartHeaderValue" style={{color:this.state.candelColor}}>{this.state.stat.Close}</span>
                </div>
                {
                    this.props.homePage &&
                    <div className="chart_sub_header">
                    <span className={`subVal${this.state.selectedYear=== "1"? " active" : ""}`} onClick={this.onSubMenuClick.bind(this, "1")}>1Y</span>
                    <span className={`subVal${this.state.selectedYear=== "2"? " active" : ""}`} onClick={this.onSubMenuClick.bind(this, "2")}>2Y</span>
                    <span className={`subVal${this.state.selectedYear=== "3"? " active" : ""}`} onClick={this.onSubMenuClick.bind(this, "3")}>3Y</span>
                    <span className={`subVal${this.state.selectedYear=== "4"? " active" : ""}`} onClick={this.onSubMenuClick.bind(this, "4")}>4Y</span>
                    <span className={`subVal${this.state.selectedYear=== "5"? " active" : ""}`} onClick={this.onSubMenuClick.bind(this, "5")}>5Y</span>
                    <span className={`subVal${this.state.selectedYear=== "6"? " active" : ""}`} onClick={this.onSubMenuClick.bind(this, "6")}>6Y</span>
                    <span className={`subVal${this.state.selectedYear=== "7"? " active" : ""}`} onClick={this.onSubMenuClick.bind(this, "7")}>7Y</span>
                    <span className={`subVal${this.state.selectedYear=== "8"? " active" : ""}`} onClick={this.onSubMenuClick.bind(this, "8")}>8Y</span>
                    <span className={`subVal${this.state.selectedYear=== "9"? " active" : ""}`} onClick={this.onSubMenuClick.bind(this, "9")}>9Y</span>
                    <span className={`subVal${this.state.selectedYear=== "10"? " active" : ""}`} onClick={this.onSubMenuClick.bind(this, "10")}>All</span>
                </div>
                }
                <div className="chart_container">
                    <svg id="container"></svg>
                </div>
            </React.Fragment>
		);
	}
}

export default ChartView;