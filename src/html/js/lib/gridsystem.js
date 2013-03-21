GridSystem = function(parent, cellCount, heightMultiplier) {
  this.parent = parent;
  this.cellCount = cellCount;
  this.heightMultiplier = heightMultiplier;
  var cols = [1,2,4,6,12];
  // this.dimension = Math.ceil(Math.sqrt(this.cellCount));
  this.dimension = this.cellCount;
  this.createRows();
  this.createCells();
}

GridSystem.prototype.createRows = function() {
  this.rows = [];
  // for(var i=0;i<this.dimension;i++) {
    this.rows.push(this.parent.append("div").classed("row-fluid", true));
  // }
}

GridSystem.prototype.createCells = function() {  
  this.cells = [];
  for(var i=0;i<this.cellCount;i++) {
    // var row = this.rows[Math.floor(i/this.dimension)]
    var row = this.rows[0]
    this.cells.push(new GridCell(row, Math.floor(12/this.dimension), this.heightMultiplier));
  }

}

GridSystem.prototype.getGridCells = function() {
  return this.cells;
}


GridCell = function(parent, size, heightMultiplier) {
  this.parent = parent;
  this.elm = this.parent.append("div").classed("span" + size + " grid_cell", true);
  this.elm.style("height", (parseInt(this.elm.style("width")) * heightMultiplier) + "px");

}

GridCell.prototype.getElm = function() {
  return this.elm;
}

GridCell.prototype.bind = function(action, func) {
  this.elm.on(action, func);  
}