window.onload = function() {
  queue()
    .defer(d3.json, "data/cities.json")
    .await(loadData);
}

function loadData(error, cityData) {
  var cells = 3;
  d3.select("#start").on("click", start);
  var topGrid = new GridSystem(d3.select('#container'), cells, .11);
  var topCells = topGrid.getGridCells();
  var midGrid = new GridSystem(d3.select('#container'), cells, 1);
  var midCells = midGrid.getGridCells();
  var bottomGrid = new GridSystem(d3.select('#container'), cells, .4);
  var botCells = bottomGrid.getGridCells();

  var promise = new Promise();
  timeEventRegistry = new TimeEventRegistry(d3.select('#clock'));
  timeBar = new TimeBar(timeEventRegistry, d3.select('#timebar'));
  cityMaps = [];
  for(var i=0;i<cells;i++) {
    cityMaps.push(new CityMap(0, cityData, topCells[i].getElm(), midCells[i].getElm(), botCells[i].getElm(),
                              promise, timeEventRegistry));
  }
}

function start() {
  for(var i=0;i<cityMaps.length;i++) {
    cityMaps[i].registerTimeEvents();
  }
  timeEventRegistry.sort();
  timeBar.ready();
  timeEventRegistry.sort();
  timeEventRegistry.start(); 
  timeBar.start();
}