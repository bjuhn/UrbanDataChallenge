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
  var gridSystem = new GridSystem(d3.select('#container'), 3);
  var cells = gridSystem.getGridCells();
  var promise = new Promise();
  timeEventRegistry = new TimeEventRegistry(d3.select('#clock'));

  for(var i=0;i<cells.length;i++) {
    var proj = d3.geo
      .mercator()
      .center([110,0])
      .scale(1 << 9);
    map = new Map(cells[i].getElm(), proj);
    map.addFeatures(sf.features, "city");
    map.zoomTo(sf, 0, .9);
    promise.addCall(map, map.zoomTo, [sf, 0, .9], false);
    
    var route = new Route(routeData, routeSegmentData, map.getGElm(), map.getPath());
    route.makeRoute();
    for(var j=0;j<busData.length;j++) {
      var bus = new Bus(busData[j], map.getGElm(), route, timeEventRegistry);
    }
    for(var j=0;j<stopData.length;j++) {
      var stop = new Stop(stopData[j], map.getGElm(), proj, timeEventRegistry);
    }
    promise.addCall(map, map.zoomTo, [routeSegmentData, 1200, .8], false);
    promise.addCall(map, map.addImage, [], true);
  }

  timeBar = new TimeBar(timeEventRegistry, d3.select('#timebar'));
  promise.begin(doneLoadSequence);
}

function doneLoadSequence(){
  timeEventRegistry.start();
}