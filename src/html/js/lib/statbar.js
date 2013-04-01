StatBar = function(gElm, metric) {
  this.gElm = gElm;
  this.metric = metric;
  this.extras = metric.extras || {};

  this.textOffset = 120;
  this.rightOffset = 20;
  this.textTopOffset = 5;
  this.barTopOffset = 27;
  this.barHeight = this.extras.barHeight || 8;
  var w = this.gElm.attr('width');
  var statBarClass = (this.extras.statBarClass + " " || "") + "statbar-fill";
  var fontClass = (this.extras.fontClass + " " || "") + "statbar-text";

  this.box = this.gElm.append("rect")
    .attr("x", 0)
    .attr("y", this.barTopOffset)
    .attr("width", w - this.rightOffset)
    .attr("height", this.barHeight)
    .classed("statbar-box", true);

  this.bar = this.gElm.append("rect")
    .attr("width", 0)
    .attr("height", this.barHeight-2)
    .attr("y", this.barTopOffset + 1)
    .attr("x", 0)
    .classed(statBarClass, true); 

  this.gElm.append("text")
    .text(metric.name)
    .classed(fontClass, true)
    .attr("y", this.textTopOffset)
    .attr("text-anchor", "start")
    .attr("dy", ".71em");

  this.val = this.gElm.append("text")
    .text(0 + " " + this.metric.type)
    .classed("statbar-val", true)
    .attr("y", this.textTopOffset)
    .attr("x", w - this.rightOffset)
    .attr("text-anchor", "end")
    .attr("dy", ".71em");

}

StatBar.prototype.update = function(val) {
    this.val.text(val + " " + this.metric.type)
    this.bar.transition().duration(800)
      .attr("width", val/this.metric.range[1] * this.box.attr("width"));
}

StatBar.prototype.setRange = function(min, max) {
  this.metric.range = [min, max];
}