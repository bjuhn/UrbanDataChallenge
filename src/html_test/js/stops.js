window.onload = function() {
  queue().defer(d3.json, "../../data/scheduled-arrivals.excerpt.json")
    .defer(d3.json, "../../data/sf2.geojson")
    .defer(d3.json, "../../data/world-countries.json")
    .defer(d3.json, "../../sub/udc/public-transportation/san-francisco/geo/topojson/routes.json")
    .await(loadData);
}

function loadData(error, test_point, sf, countries, sf_routes) {
xe = test_point;
  var gridSystem = new GridSystem(d3.select('#container'), 2);
  var cells = gridSystem.getGridCells();
  var routes = topojson.object(sf_routes, sf_routes.objects.routes);
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
    var coords = test_point[5212999].features[0].geometry.coordinates;

    


    // promise.addCall(map, map.zoomTo, [sf.features[0].geometries], false);

    routeGeom = routes.geometries[0];
    var route = new Route(routeGeom, map.getGElm(), map.getPath());
    promise.addCall(map, map.zoomTo, [sf], false);


    promise.addCall(route, route.makeRoute, [], true);
    promise.addCall(route, route.startAnimateTestBus, [], true);
promise.addCall(map, map.addPoint, [coords[1], coords[0], .001, "stop"], true);

    
    // 
    // 
  }

  promise.begin(doneLoadSequence);

}

function doneLoadSequence(){
  // alert('done');
}