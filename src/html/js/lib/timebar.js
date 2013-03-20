TimeBar = function(timeEventRegistry, elm) {
  this.timeEventRegistry = timeEventRegistry;
  this.elm = elm;
  this.svg = this.elm.append("svg")
              .classed("timebar", true);

  var domain = [timeEventRegistry.getStartDate(), timeEventRegistry.getEndDate()];
  var h = parseInt(this.elm.style('height'));
  var w = parseInt(this.elm.style('width'));  
  var barHeight = 20;
  var format = d3.time.format('%b %e %I:%M %p')

  this.bar = this.svg.append("rect")
    .attr("width", 0)
    .attr("height", barHeight-2)
    .attr("y", 1)
    .classed("timebar-progress", true); 


  this.svg.append("rect")
    .attr("width", w)
    .attr("height", barHeight)
    .classed("timebar-box", true);

  this.svg.append("line")
    .attr("x1", 1)
    .attr("y1", barHeight)
    .attr("x2", 1)
    .attr("y2", barHeight + 10)

  this.svg.append("line")
    .attr("x1", w-1)
    .attr("y1", barHeight)
    .attr("x2", w-1)
    .attr("y2", barHeight + 10)

  this.svg.append("line")
    .attr("x1", w/2)
    .attr("y1", barHeight)
    .attr("x2", w/2)
    .attr("y2", barHeight + 10)

  this.svg.append("text")
    .text(format(domain[0]))
    .attr("text-anchor", "start")
    .attr("x", 1)
    .attr("y", barHeight + 12)
    .attr("dy", ".71em")

  this.svg.append("text")
    .text(format(domain[1]))
    .attr("text-anchor", "end")
    .attr("x", w-1)
    .attr("y", barHeight + 12)
    .attr("dy", ".71em")

    var d = new Date(domain[0].getTime() + (domain[1].getTime() - domain[0].getTime())/2);

  this.svg.append("text")
    .text(format(d))
    .attr("text-anchor", "middle")
    .attr("x", w/2)
    .attr("y", barHeight + 12)
    .attr("dy", ".71em")

  timeEventRegistry
    .register(timeEventRegistry.getStartDate(), 
              bind(this, this.start),
              timeEventRegistry.getEndDate());


}

TimeBar.prototype.start = function() {
  var duration = (timeEventRegistry.getEndDate() - timeEventRegistry.getStartDate()) / timeEventRegistry.getMultiplier();
  var w = parseInt(this.elm.style('width'));  
  this.bar.transition()
    .duration(duration)
    .ease("linear")
    .attr("width", w);
}

