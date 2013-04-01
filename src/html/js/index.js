window.onload = function() {
  sizeElement();
  queue()
    .defer(d3.json, "data/cities.json")
    .await(loadData);
}

function loadData(error, cityData) {
  var cells = 3;
  var format = d3.time.format("%Y-%m-%d %H:%M");
  var startDate = format.parse('2012-10-04 10:00');
  var endDate = format.parse('2012-10-04 12:00');

  d3.select("#start").on("click", start);
  var promise = new Promise();
  timeEventRegistry = new TimeEventRegistry(d3.select('#clock'), startDate, endDate);
  timeBar = new TimeBar(timeEventRegistry, d3.select('#timebar'), startDate, endDate);
  cityMaps = [];
  for(var i=0;i<cells;i++) {
    var topCell = d3.select('#cell1-' + (i+1));
    var midCell = d3.select('#cell2-' + (i+1));
    var botCell = d3.select('#cell3-' + (i+1));
    cityMaps.push(new CityMap(0, cityData, topCell, midCell, botCell, promise, timeEventRegistry));
  }
}

function start() {
  for(var i=0;i<cityMaps.length;i++) {
    cityMaps[i].registerTimeEvents();
  }

  var maxPassengers = 0;
  for(var i=0;i<cityMaps.length;i++) {
    var passengers = cityMaps[i].getMaxPassengers();
    if (passengers > maxPassengers) {
      maxPassengers = passengers;
    }
  }
  for(var i=0;i<cityMaps.length;i++) {
    cityMaps[i].setMaxPassengers(maxPassengers);
  }

  timeEventRegistry.sort();
  timeBar.ready();
  timeEventRegistry.sort();
  timeEventRegistry.start(); 
  timeBar.start();
}

function sizeElement() {
  var pageWidth = parseInt(d3.select('body').style('width'), 10);

  for(var i=0;i<3;i++) {
    var topCell = d3.select('#cell1-' + (i+1));
    var midCell = d3.select('#cell2-' + (i+1));
    var botCell = d3.select('#cell3-' + (i+1));
    midCell.style('height', parseInt(midCell.style("width"), 10) + "px");
  }
  var sideHeight = parseInt(d3.select('#container2').style('height'), 10);
  d3.select('#sideLegend')
    .style('height', sideHeight + "px");
  var textHeight = parseInt(d3.select('.side-text').style('height'), 10);
  d3.select('.side-text')
    .style('top', (sideHeight/2 - textHeight/2) + "px");
  d3.select('#sideLegend')
  .style('height', (sideHeight - 2) + "px");

}