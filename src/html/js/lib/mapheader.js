MapHeader = function(elm) {
  this.container = elm.append("ul")
    .classed("button-bar", true)
  // var tmp = this.container.append("div")
  //   .classed("navbar-inner", true);
  // this.inner = tmp.append("ul")
  //   .classed("nav", true);
}

MapHeader.prototype.getElm = function() {
  return this.container;
}