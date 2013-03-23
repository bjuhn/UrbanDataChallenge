
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
  var topGrid = new GridSystem(d3.select('#container'), 3, 1);
  var topCells = topGrid.getGridCells();
  var bottomGrid = new GridSystem(d3.select('#container'), 3, .4);
  var bottomCells = bottomGrid.getGridCells();

  var promise = new Promise();
  timeEventRegistry = new TimeEventRegistry(d3.select('#clock'));

  for(var i=0;i<topCells.length;i++) {
    var proj = d3.geo
      .mercator()
      .center([110,0])
      .scale(1 << 9);
    map = new Map(topCells[i].getElm(), proj);
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