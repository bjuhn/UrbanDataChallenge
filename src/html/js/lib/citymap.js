CityMap = function(cityIdx, cities, topElm, midElm, botElm, promise, timeEventRegistry) {
  this.city = cities[cityIdx];
  this.cities = cities;
  this.topElm = topElm;
  this.midElm = midElm;
  this.botElm = botElm;
  this.promise = promise;
  this.timeEventRegistry = timeEventRegistry;

  this.routeIdx = null;
  this.metrics = [
    {name: "average speed", range: [0, 60], type: "km/h"},
    {name: "passengers", range: [0, 300], type: ""},
    {name: "est. wait time", range: [0, 60], type: "min"},
    {name: "overall score", range: [0, 100], type: "", extras: {barHeight: 10, statBarClass: "overall-bar", fontClass: "overall-text", paddingTop: 15}}
  ]

  this.setup();
  this.selectCity(this.cities[cityIdx]);
}

CityMap.prototype.setup = function() {
  this.header = new MapHeader(this.topElm);
  this.citySelector = new DropDown(this.header.getElm(), this.cities, 'City');
  this.citySelector.bind("onselect", bind(this, this.selectCity));
  this.routeSelector = new DropDown(this.header.getElm(), [], 'Route');
  this.routeSelector.bind("onselect", bind(this, this.selectRoute));

  this.proj = d3.geo
    .mercator()
    .center([110,0])
    .scale(1 << 9);

  this.map = new Map(this.midElm, this.proj);
  this.baseMapImage = this.map.addImage(this.city["img"], this.city["bounds"]);
  this.map.zoomToBounds(this.city["bounds"], 0, 1);
  this.statBars = new StatBars(this.botElm, this.metrics);

  this.route = new Route(this.map.getGElm(), this.map.getPath(), this.timeEventRegistry, this.proj);
  this.route.bind("changeAvgSpeed", bind(this.statBars.getBar(0), this.statBars.getBar(0).update));
  this.route.bind("changePassengers", bind(this.statBars.getBar(1), this.statBars.getBar(1).update));
  this.route.bind("changeWaitTime", bind(this.statBars.getBar(2), this.statBars.getBar(2).update));
  this.route.bind("changeRank", bind(this.statBars.getBar(3), this.statBars.getBar(3).update));
}

CityMap.prototype.selectCity = function(city) {
  this.citySelector.changeLabel(city.lbl);
  this.baseMapImage.remove();
  this.city = city;
  this.baseMapImage = this.map.addImage(city["img"], city["bounds"]);
  this.map.zoomToBounds(city["bounds"], 0, 1);
  queue().defer(d3.json, "data/routes/" + city["prefix"] + "_routes.json")
    .await(bind(this, this._selectCityCallback));
}

CityMap.prototype._selectCityCallback = function(err, routes) {
  this.routes = routes;
  this.routeSelector.setItems(routes, "name", "routeId");
  this.selectRoute(routes[3]);
}

CityMap.prototype.selectRoute = function(routeData) {
  this.routeSelector.changeLabel(routeData.name);
  this.currentRouteData = routeData;
  var routeId = routeData["routeId"];
  var cityPrefix = this.city["prefix"];
  queue()
    .defer(d3.json, "data/buses/" + cityPrefix + "_" + routeId + ".json")
    .defer(d3.json, "data/segments/" + cityPrefix + "_" + routeId + ".json")
    .defer(d3.json, "data/stops/" + cityPrefix + "_" + routeId + ".json")
    .await(bind(this, this._selectRouteCallback));
}

CityMap.prototype._selectRouteCallback = function(err, buses, segments, stops) {
  this.route.setRoute(this.currentRouteData, buses, segments, stops);
  this.map.zoomToFeature(segments, 1200, .95);
  // promise.addCall(map, map.zoomTo, [segments, 1200, .95], false);
}

CityMap.prototype.registerTimeEvents = function() {
  this.route.registerTimeEvents();
}

CityMap.prototype.getMaxPassengers = function() {
  return this.route.getMaxPassengers();
}

CityMap.prototype.setMaxPassengers = function(max) {
  this.route.setMaxPassengers(max);
  this.statBars.getBar(1).setRange(0, max);
}
