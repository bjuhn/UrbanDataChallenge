
window.onload = function() {
  queue()
    .defer(d3.json, "data/sf2.geojson")
    .defer(d3.json, "data/routes/bus_test.json")
    .defer(d3.json, "data/routes/route_test.json")
    .defer(d3.json, "data/routes/segments_test.json")
    .defer(d3.json, "data/routes/stop_test.json")
    .await(loadData);
}
// TODO, handle multiple buses
function loadData(error, sf, busData, routeData, routeSegmentData, stopData) {
  var cells = 3;

  var cities = [{"lbl": "Geneva", "val": 0},
                {"lbl": "San Francisco", "val": 1},
                {"lbl": "Zurich", "val": 2}]

  var routes = [{"lbl": "Test Route", "val": 0},
                {"lbl": "1 California", "val": 1},
                {"lbl": "43 Masonic", "val": 2}]


  var topGrid = new GridSystem(d3.select('#container'), cells, .11);
  var topCells = topGrid.getGridCells();
  var midGrid = new GridSystem(d3.select('#container'), cells, 1);
  var midCells = midGrid.getGridCells();
  var bottomGrid = new GridSystem(d3.select('#container'), cells, .4);
  var bottomCells = bottomGrid.getGridCells();

  var promise = new Promise();
  timeEventRegistry = new TimeEventRegistry(d3.select('#clock'));

  for(var i=0;i<cells;i++) {
  
    var header = new MapHeader(topCells[i].getElm());
    var dropDown = new DropDown(header.getElm(), cities, 'City');
    var dropDown = new DropDown(header.getElm(), routes, 'Route');

    var proj = d3.geo
      .mercator()
      .center([110,0])
      .scale(1 << 9);
    map = new Map(midCells[i].getElm(), proj);
    // map.addFeatures(sf.features, "city");
    map.addImage();

    map.zoomTo(sf, 0, .9);
    promise.addCall(map, map.zoomTo, [sf, 0, .9], false);

    var route = new Route(routeData, routeSegmentData, map.getGElm(), map.getPath());
    route.makeRoute();
    for(var j=0;j<busData.length;j++) {
      var bus = new Bus(busData[j], map.getGElm(), route, timeEventRegistry);
    }
    for(var j=0;j<stopData.length;j++) {
      var stop = new Stop(stopData[j], map.getGElm(), proj, timeEventRegistry, route);
    }
    var metrics = [
      {name: "Avg Speed", range: [0, 100]},
      {name: "Passengers", range: [0, 300]}
    ]
    var statBars = new StatBars(bottomCells[i].getElm(), metrics)

    route.bind("changeAvgSpeed", bind(statBars.getBar(0), statBars.getBar(0).update));
    route.bind("changePassengers", bind(statBars.getBar(1), statBars.getBar(1).update));

    promise.addCall(map, map.zoomTo, [routeSegmentData, 1200, .95], false);

  }

  timeBar = new TimeBar(timeEventRegistry, d3.select('#timebar'));
  promise.begin(doneLoadSequence);
}

function doneLoadSequence(){
  timeEventRegistry.start();
}