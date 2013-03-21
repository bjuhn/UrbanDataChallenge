StatBars = function(elm, metrics, timeEventRegistry) {
  this.elm = elm;
  this.metrics = metrics;
  this.bars = [];
  this.barHeight = 30;
  this.barOffset = 10;
  this.barLeftOffset = 10;
  this.svg = this.elm.append("svg")
              .classed("statbars", true)
              .attr("height", metrics.length * (this.barHeight + this.barOffset));

  var w = parseInt(this.elm.style('width'));  
  for(var i=0;i<metrics.length;i++) {
    var container = this.svg.append("g")
      .attr("transform", "translate(" + this.barLeftOffset + "," + (this.barOffset + ((this.barHeight + this.barOffset) * i)) + ")")
      .attr("height", this.barHeight)
      .attr("width", w)
      .attr("y", this.barOffset);
    this.bars.push(new StatBar(container, metrics[i], this.barHeight))
  }
  timeEventRegistry
    .register(timeEventRegistry.getStartDate(), 
              bind(this, this.start),
              timeEventRegistry.getEndDate());

}

StatBars.prototype.start = function() {
  for(var i=0;i<this.bars.length;i++) {
    this.bars[i].start();
  }
}