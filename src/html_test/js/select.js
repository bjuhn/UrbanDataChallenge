window.onload = function() {
  queue().defer(d3.json, "../../data/scheduled-arrivals.excerpt.json")
    .defer(d3.json, "../../data/sf.json")
    .defer(d3.json, "../../data/world-countries.json")
    .defer(d3.json, "../../sub/udc/public-transportation/san-francisco/geo/topojson/routes.json")
    .await(loadData);
}

function loadData(error, test_point, sf, countries, sf_routes) {
  var routeSelector = new RouteSelector(d3.select('#container'), sf_routes, countries);
  // routeSelector.bind("f", bind())
}


RouteSelector = function(container, routes, countries) {
  this.container = container;
  this.routes = routes
  this.countries = countries;
  this.topoRoutes = topojson.object(routes, routes.objects.routes);
  this.gridSystem = new GridSystem(this.container, routes.objects.routes.geometries.length);
  this.show();
}
jkl = false;
RouteSelector.prototype.show = function() {
  maps = []
  var cells = this.gridSystem.getGridCells(); 
  for(var i=0;i<cells.length;i++) {
  var proj = d3.geo
    .mercator()
    .center([ "-125.499774", "37.79379" ])
    .scale(1 << 21);

    var map = new Map(cells[i].getElm(), proj);
    // map.addFeatures(this.countries.features, "countries");
    var routeGeom = this.routes.objects.routes.geometries[i];
    var route = new Route(this.topoRoutes.geometries[i], map.getGElm(), map.getPath());
    map.zoomTo(this.topoRoutes.geometries[i], 0, .8);
    route.animating = false;    
    // cells[i].bind("mouseover", bindArr(this, mouseOverElm, [map, route]));
    // cells[i].bind("mouseout", bindArr(this, mouseOutElm, [map, route]));
    maps.push([map, this.topoRoutes.geometries[i]]);
  }
  this.container.append('button').classed('btn btn-success', true).text('RACE');

}

function mouseOverElm(map, route) {
  if(route.animating == false) {
    route.animating = true;  
    map.zoomTo(route.getGeom(), 500, 1.2);
  }
}

function mouseOutElm(map, route) {
  route.animating = false;
  map.zoomTo(route.getGeom(), 500, .8);
}