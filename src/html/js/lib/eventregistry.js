EventRegistry = function() {
  this.registry = {};
}

EventRegistry.prototype.bind = function(eventName, func) {
  if(typeof this.registry[eventName] == "undefined") {
    this.registry[eventName] = [];
  }
  this.registry[eventName].push(func);
}

EventRegistry.prototype.fire = function(eventName) {
  var attr = Array.prototype.slice.call(arguments, 1); 
  for(var i=0; i<this.registry[eventName].length; i++) {
    var func = this.registry[eventName][i];
    func.apply(func, attr);
  }
}