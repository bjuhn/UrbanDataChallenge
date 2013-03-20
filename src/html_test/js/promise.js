Promise = function() {
  this.calls = [];
  this.callCounter = 0;
}

Promise.prototype.addCall = function(context, func, args, instant) {
  args.push(bind(this, this.callback));
  this.calls.push({
    func: bindArr(context, func, args), 
    instant: instant
  });
}

Promise.prototype.begin = function(doneCallBack) {
  this.doneCallBack = doneCallBack;
  this.counter = 0;
  this.callNext();
}

Promise.prototype.callback = function() {
  this.counter++;
  this.callNext();
}

Promise.prototype.callNext = function() {
  if(this.counter < this.calls.length) {
    var call = this.calls[this.counter];
    call.func.call();
    if(call.instant == true) {
      this.callback();
    }
  }else{
    this.doneCallBack.call();
  }
}