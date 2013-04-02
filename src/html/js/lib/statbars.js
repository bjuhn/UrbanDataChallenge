StatBars = function(elm, metrics) {
  this.elm = elm;
  this.metrics = metrics;
  this.bars = [];
  this.barHeight = 35;
  this.barOffset = 10;
  this.barLeftOffset = 10;
  this.svg = this.elm.append("svg")
              .classed("statbars", true)
              .style("height", (metrics.length * (this.barHeight + this.barOffset) + 20) + "px");

  var w = parseInt(this.elm.style('width'), 10);  
  for(var i=0;i<metrics.length;i++) {
    var extras = metrics[i].extras || {};
    var paddingTop = extras.paddingTop || 0;
    var container = this.svg.append("g")
      .attr("transform", "translate(" + this.barLeftOffset + "," + (this.barOffset + ((this.barHeight + this.barOffset) * i) + paddingTop) + ")")
      .attr("height", this.barHeight)
      .attr("width", w);
      // .attr("y", this.barOffset );
    this.bars.push(new StatBar(container, metrics[i], this.barHeight))
  }
}

StatBars.prototype.getBar = function(idx) {
  return this.bars[idx];
}