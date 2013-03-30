function bind(scope, fn) {
  var outerArgs = Array.prototype.slice.call(arguments, 2); 
    return function () {
      var args = Array.prototype.concat.call(toArray(arguments), outerArgs);
        return fn.apply(scope, args);
    };
}

function bindArr(scope, fn, args) {
    return function () {
        return fn.apply(scope, args);
    };
}

function toArray(obj) {
    return Array.prototype.slice.call(obj);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random((new Date()).getTime()) * (max - min + 1)) + min;
}