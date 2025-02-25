window.onload = function() {
  queue().defer(d3.json, "../../data/scheduled-arrivals.excerpt.json")
    .defer(d3.json, "../../data/sf.json")
    .defer(d3.json, "../../data/world-countries.json")
    .defer(d3.json, "../../data/zurich_routes.json")
    .await(loadData);
}

function loadData(error, test_point, sf, countries, sf_routes) {
abcdef = sf_routes;
alert(1);
  var gridSystem = new GridSystem(d3.select('#container'), 1);
  var cells = gridSystem.getGridCells();
  // var routes = topojson.object(sf_routes, sf_routes.objects.routes);
  var promise = new Promise();

  for(var i=0;i<cells.length;i++) {
    var proj = d3.geo
      .mercator()
      .center([110,0])
      .scale(1 << 9);
    var map = new Map(cells[i].getElm(), proj);
    map.addFeatures(countries.features, "countries");
    a = countries;
    map.zoomTo(countries.features, 20000);
    d = sf;
    promise.addCall(map, map.addFeatures, [sf.features, "city"], true);
    // promise.addCall(map, map.zoomTo, [sf.features[0].geometries], false);
// alert(routes.geometries.length);
    routeGeom = sf_routes.features[5]
    var route = new Route(routeGeom, map.getGElm(), map.getPath());
    promise.addCall(map, map.zoomTo, [routeGeom], false);


    promise.addCall(route, route.makeRoute, [], true);
    promise.addCall(route, route.startAnimateBus, [], true);


    
    // 
    // 
  }

  promise.begin(doneLoadSequence);

}

function doneLoadSequence(){
  // alert('done');
}