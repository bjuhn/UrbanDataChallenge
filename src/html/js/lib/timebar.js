TimeBar = function(timeEventRegistry, elm, startDate, endDate) {
  this.timeEventRegistry = timeEventRegistry;
  this.elm = elm;
  this.svg = this.elm.append("svg")
              .classed("timebar", true);

  this.h = parseInt(this.elm.style('height'), 10);
  this.w = parseInt(this.elm.style('width'), 10);  
  this.barHeight = 5;
  this.textOffset = 60;
  this.textTop = 26;
  this.notchHeight = 30;
  this.format = d3.time.format('%b%e %H:%M')

  this.svg.append("rect")
    .attr("width", this.w)
    .attr("height", this.barHeight)
    .attr("y", this.textOffset)
    .classed("timebar-box", true);

  this.bar = this.svg.append("rect")
     .attr("x", 1)
     .attr("y", this.textOffset - this.notchHeight/2 + this.barHeight/2)
     .attr("width", this.barHeight)
     .attr("height", this.notchHeight)
     .classed("timebar-line", true)

  this.dateElms = [
    this.svg.append("text")
      .text(this.format(startDate))
      .attr("text-anchor", "start")
      .attr("x", 1)
      .attr("y", this.textTop)
      .attr("dy", ".71em"),
    this.svg.append("text")
      .text(this.format(this.calculateDate(startDate, endDate, 1, 4)))
      .attr("text-anchor", "middle")
      .attr("x", this.w/4)
      .attr("y", this.textTop)
      .attr("dy", ".71em"),
    this.svg.append("text")
      .text(this.format(this.calculateDate(startDate, endDate, 2, 4)))
      .attr("text-anchor", "middle")
      .attr("x", this.w/2)
      .attr("y", this.textTop)
      .attr("dy", ".71em"),
    this.svg.append("text")
      .text(this.format(this.calculateDate(startDate, endDate, 3, 4)))
      .attr("text-anchor", "middle")
      .attr("x", this.w/4*3)
      .attr("y", this.textTop)
      .attr("dy", ".71em"),
    this.svg.append("text")
      .text(this.format(endDate))
      .attr("text-anchor", "end")
      .attr("x", this.w-1)
      .attr("y", this.textTop)
      .attr("dy", ".71em")
  ];
}

TimeBar.prototype.calculateDate = function(startDate, endDate, seq, max) {
  return new Date(startDate.getTime() + ((endDate.getTime() - startDate.getTime())/max * seq));
}

TimeBar.prototype.ready = function() {
  var domain = [timeEventRegistry.getStartDate(), timeEventRegistry.getEndDate()];
  this.duration = (domain[1] - domain[0]) / timeEventRegistry.getMultiplier();
  this.timeEventRegistry
    .register(domain[0], bind(this, this.start), domain[1]);
}

TimeBar.prototype.start = function() {
  this.bar.transition()
    .duration(this.duration)
    .ease("linear")
    .attr("x", this.w-this.barHeight);
}