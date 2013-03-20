window.onload = function() {
  queue().defer(d3.json, "../../data/scheduled-arrivals.excerpt.json")
    .defer(d3.json, "../../data/sf.json")
    .defer(d3.json, "../../data/world-countries.json")
    .defer(d3.json, "../../sub/udc/public-transportation/san-francisco/geo/geojson/routes_test.json")
    .await(loadData);
}

function loadData(error, test_point, sf, countries, sf_routes) {

  var gridSystem = new GridSystem(d3.select('#container'), 2);
  var cells = gridSystem.getGridCells();
  var routes = sf_routes;
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

//    var routeGeom = routes.geometries[0];//Math.floor(Math.random() * routes.geometries.length)];
    var route = new Route(routes, map.getGElm(), map.getPath());
    promise.addCall(map, map.zoomTo, [routes], false);
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