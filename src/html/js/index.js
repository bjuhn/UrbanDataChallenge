window.onload = function() {
  var isMSIE = /*@cc_on!@*/0;
  if (isMSIE) {
    alert('Internet Explorer is not supported.  Please use Google Chome, Safari, or Firefox.');
  }

  sizeElement();
  preLoader();
  queue()
    .defer(d3.json, "data/cities.json")
    .await(loadData);
}

function preLoader() {
  preloads = "carot.png,legend-bottom.png,M-Geneva-50000-01-sm.jpg,M-SF-50000-01-sm.jpg,M-Zurich-50000-01-sm.jpg".split(",")
  var tempImg = []

  for(var x=0;x<preloads.length;x++) {
      tempImg[x] = new Image()
      tempImg[x].src = 'images/' + preloads[x]
  }
}

function loadData(error, cityData) {
  var cells = 3;
  var format = d3.time.format("%Y-%m-%d %H:%M");
  var startDate = format.parse('2012-10-04 10:00');
  var endDate = format.parse('2012-10-04 12:00');

  var promise = new Promise();
  timeEventRegistry = new TimeEventRegistry(d3.select('#clock'), startDate, endDate);
  timeBar = new TimeBar(timeEventRegistry, d3.select('#timebar'), startDate, endDate);
  cityMaps = [];
  for(var i=0;i<cells;i++) {
    var topCell = d3.select('#cell1-' + (i+1));
    var midCell = d3.select('#cell2-' + (i+1));
    var botCell = d3.select('#cell3-' + (i+1));
    var cityMap = new CityMap(i, cityData, topCell, midCell, botCell, promise, timeEventRegistry)
    cityMap.bind('routeSelected', bind(this, enableStart));
    cityMap.bind('citySelected', bind(this, enableStart));
    cityMaps.push(cityMap);
  }
}

function enableStart() {
  var ready = true;
  for(var i=0;i<cityMaps.length;i++) {
    ready = ready && cityMaps[i].getRoute().isSet();
  }

  if (ready) {
    d3.select("#start")
      .on("click", start)
      .classed('ready', true);
  }else{
    d3.select("#start")
      .on("click", null)
      .classed('ready', false);
  }
}

function start() {

  d3.select("#start")
    .on("click", null)
    .classed('ready', false);

  for(var i=0;i<cityMaps.length;i++) {
    cityMaps[i].toggleInteractive(false);
  }

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
  var width = parseInt(d3.select('#cell2-1').style("width"), 10);
  for(var i=0;i<3;i++) {
    var topCell = d3.select('#cell1-' + (i+1));
    var midCell = d3.select('#cell2-' + (i+1));
    var botCell = d3.select('#cell3-' + (i+1));
    midCell.style('height', width + "px");
  }
  var sideHeight = parseInt(d3.select('#container2').style('height'), 10);
  var textHeight = parseInt(d3.select('.side-text').style('height'), 10);
  var marginOffset = 6;

  d3.select('#sideLegend')
    .style('height', (sideHeight - marginOffset) + "px");
  d3.select('.side-text')
    .style('top', (sideHeight/2 - textHeight/2)  + "px");
  // d3.select('#sideLegend')
  // .style('height', (sideHeight - 2) + "px");
}
