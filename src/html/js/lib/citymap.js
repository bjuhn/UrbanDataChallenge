CityMap = function(cityIdx, cities, topElm, midElm, botElm, promise, timeEventRegistry) {
  this.city = cities[cityIdx];
  this.cities = cities;
  this.topElm = topElm;
  this.midElm = midElm;
  this.botElm = botElm;
  this.promise = promise;
  this.timeEventRegistry = timeEventRegistry;
  this.events = new EventRegistry();
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
  this.createLoader();
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

CityMap.prototype.bind = function(eventName, func) {
  this.events.bind(eventName, func);
}


CityMap.prototype.selectCity = function(city) {
  this.loading(true);
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
  this.route.clear();
  this.events.fire("citySelected");
  this.loading(false);
}

CityMap.prototype.selectRoute = function(routeData) {
  if(routeData.routeId == null) return;
  this.loading(true);
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
  this.events.fire("routeSelected");
  this.loading(false);
}

CityMap.prototype.getRoute = function() {
  return this.route;
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

CityMap.prototype.createLoader = function(on) {
  this.loaderElm = this.midElm.append('div')
    .classed('loader', true)
    .style("display", "none");
  this.loaderElm.append('img').attr('src', 'images/loading-thumb.gif');
}

CityMap.prototype.toggleInteractive = function(on) {
  this.citySelector.toggle(on);
  this.routeSelector.toggle(on);
}

CityMap.prototype.loading = function(on) {
  if (on) {
    var img = this.loaderElm.select('img');
    var svg = this.midElm.select('svg')
    var pos = $(svg[0]).position()
    var height = parseInt(svg.style('height'), 10);
    var width = parseInt(svg.style('width'), 10);
    var loaderImgHeight = parseInt(img.style('height'), 10);
    var loaderImgWidth = parseInt(img.style('width'), 10);
    img.style('top', (height/2 - loaderImgHeight/2) + 'px')
      .style('left', (width/2 - loaderImgWidth/2) + 'px');

    this.loaderElm
      .style('width', (width) + "px")
      .style('height', (height) + "px")
      .style('top', 0 + "px")
      .style('left', 0 + "px")
      .style("display", "block");
    this.toggleInteractive(!on);
  } else {
    this.loaderElm.style("display", "none");
    this.toggleInteractive(!on);
  }
}
