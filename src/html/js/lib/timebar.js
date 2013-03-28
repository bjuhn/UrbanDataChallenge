TimeBar = function(timeEventRegistry, elm) {
  this.timeEventRegistry = timeEventRegistry;
  this.elm = elm;
  this.svg = this.elm.append("svg")
              .classed("timebar", true);

  this.h = parseInt(this.elm.style('height'));
  this.w = parseInt(this.elm.style('width'));  
  this.barHeight = 20;
  this.format = d3.time.format('%b %e %I:%M %p')

  this.bar = this.svg.append("rect")
    .attr("width", 0)
    .attr("height", this.barHeight-2)
    .attr("y", 1)
    .classed("timebar-progress", true);

  this.svg.append("rect")
    .attr("width", this.w)
    .attr("height", this.barHeight)
    .classed("timebar-box", true);

  this.svg.append("line")
    .attr("x1", 1)
    .attr("y1", this.barHeight)
    .attr("x2", 1)
    .attr("y2", this.barHeight + 10)

  this.svg.append("line")
    .attr("x1", this.w-1)
    .attr("y1", this.barHeight)
    .attr("x2", this.w-1)
    .attr("y2", this.barHeight + 10)

  this.svg.append("line")
    .attr("x1", this.w/2)
    .attr("y1", this.barHeight)
    .attr("x2", this.w/2)
    .attr("y2", this.barHeight + 10)

}

TimeBar.prototype.ready = function() {
  var domain = [timeEventRegistry.getStartDate(), timeEventRegistry.getEndDate()];
  this.duration = (domain[1] - domain[0]) / timeEventRegistry.getMultiplier();
  var d = new Date(domain[0].getTime() + (domain[1].getTime() - domain[0].getTime())/2);

  this.timeEventRegistry
    .register(domain[0], bind(this, this.start), domain[1]);

  this.svg.append("text")
    .text(this.format(domain[0]))
    .attr("text-anchor", "start")
    .attr("x", 1)
    .attr("y", this.barHeight + 12)
    .attr("dy", ".71em")

  this.svg.append("text")
    .text(this.format(domain[1]))
    .attr("text-anchor", "end")
    .attr("x", this.w-1)
    .attr("y", this.barHeight + 12)
    .attr("dy", ".71em")

  this.svg.append("text")
    .text(this.format(d))
    .attr("text-anchor", "middle")
    .attr("x", this.w/2)
    .attr("y", this.barHeight + 12)
    .attr("dy", ".71em")

}

TimeBar.prototype.start = function() {

  this.bar.transition()
    .duration(this.duration)
    .ease("linear")
    .attr("width", this.w);
}