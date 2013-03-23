MapHeader = function(elm) {
  this.container = elm.append("div")
    .classed("navbar navbar-static", true)
  var tmp = this.container.append("div")
    .classed("navbar-inner", true);
  this.inner = tmp.append("ul")
    .classed("nav", true);
}

MapHeader.prototype.getElm = function() {
  return this.inner;
}