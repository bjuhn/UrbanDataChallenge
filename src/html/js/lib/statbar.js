StatBar = function(gElm, metric, barHeight) {
  this.gElm = gElm;
  this.metric = metric;
  this.barHeight = barHeight;
  this.textOffset = 120;
  this.rightOffset = 20;
  this.textTopOffset = 5;
  var w = this.gElm.attr('width');

  this.bar = this.gElm.append("rect")
    .attr("width", 0)
    .attr("height", this.barHeight-2)
    .attr("y", 1)
    .attr("x", this.textOffset)
    .classed("statbar-fill", true); 

  this.box = this.gElm.append("rect")
    .attr("x", this.textOffset)
    .attr("width", w - this.textOffset - this.rightOffset)
    .attr("height", barHeight)
    .classed("statbar-box", true);

  this.gElm.append("text")
    .text(metric.name)
    .classed("statbar-text", true)
    .attr("y", this.textTopOffset)
    .attr("text-anchor", "start")
    .attr("dy", ".71em");

  this.val = this.gElm.append("text")
    .text(0)
    .classed("statbar-val", true)
    .attr("y", this.textTopOffset)
    .attr("x", this.textOffset + this.box.attr("width")/2)
    .attr("text-anchor", "middle")
    .attr("dy", ".71em");

}

StatBar.prototype.update = function(val) {
    this.val.text(val)
    this.bar.transition().duration(800)
      .attr("width", val/this.metric.range[1] * this.box.attr("width"));
}