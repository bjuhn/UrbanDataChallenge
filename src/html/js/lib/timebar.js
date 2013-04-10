TimeBar = function(timeEventRegistry, elm, startDate, endDate) {
  this.timeEventRegistry = timeEventRegistry;
  this.elm = elm;
  this.minDate = startDate;
  this.maxDate = endDate;
  this.currentDate = this.minDate;
  this.h = parseInt(this.elm.style('height'), 10);
  this.w = parseInt(this.elm.style('width'), 10);  
  this.dayIdx = 4;

  this.svg = this.elm.append("svg")
    .style("width", this.w + "px")
    .style("height", this.h + "px")
    .classed("timebar", true);

  this.barHeight = 5;
  this.daysOffset = 55;
  this.daysTop = 26;
  this.dayHOffset = 60;
  this.textOffset = 60 + this.daysOffset;
  this.textTop = 26 + this.daysOffset;
  this.notchHeight = 30;
  this.sliderMaxGap = 50;
  this.sliderOffset = 14;
  this.format = d3.time.format('%H:%M')

  this.svg.append("rect")
    .attr("width", this.w)
    .attr("height", this.barHeight)
    .attr("y", this.textOffset)
    .classed("timebar-box", true);

  this.bar = this.svg.append("rect")
     .attr("x", 12)
     .attr("y", this.textOffset - this.notchHeight/2 + this.barHeight/2)
     .attr("width", this.barHeight)
     .attr("height", this.notchHeight)
     .classed("timebar-line", true)


  var drag = d3.behavior.drag()
    .origin(Object)
    .on("drag", bind(this, this.dragStartSlider))
    .on("dragend", bind(this, this.dragSliderEnd));

  this.startOrigX = this.sliderOffset;
  this.startSlider = this.svg.append('path')
      .attr('d', 'M ' + this.startOrigX +' '+ 120 + ' l 12 12 l -24 0 z')
      .classed("timebar-slider", true)
      .attr('mx', 0)
      .call(drag);

  var dragEnd = d3.behavior.drag()
    .origin(Object)
    .on("drag", bind(this, this.dragEndSlider))
    .on("dragend", bind(this, this.dragSliderEnd));

  this.endOrigX = this.w - this.sliderOffset;
  this.endSlider = this.svg.append('path')
      .attr('d', 'M ' + this.endOrigX +' '+ 120 + ' l 12 12 l -24 0 z')
      .classed("timebar-slider", true)
      .attr('mx', 0)
      .call(dragEnd);

  this.timeElms = [];
  this.addTime(this.format(startDate), 1, this.textTop, 'start'),
  this.addTime(this.format(this.calculateDate(startDate, endDate, 1, 9)), this.w/9*1, this.textTop, 'middle'),
  this.addTime(this.format(this.calculateDate(startDate, endDate, 2, 9)), this.w/9*2, this.textTop, 'middle'),
  this.addTime(this.format(this.calculateDate(startDate, endDate, 3, 9)), this.w/9*3, this.textTop, 'middle'),
  this.addTime(this.format(this.calculateDate(startDate, endDate, 4, 9)), this.w/9*4, this.textTop, 'middle'),
  this.addTime(this.format(this.calculateDate(startDate, endDate, 5, 9)), this.w/9*5, this.textTop, 'middle'),
  this.addTime(this.format(this.calculateDate(startDate, endDate, 6, 9)), this.w/9*6, this.textTop, 'middle'),
  this.addTime(this.format(this.calculateDate(startDate, endDate, 7, 9)), this.w/9*7, this.textTop, 'middle'),
  this.addTime(this.format(this.calculateDate(startDate, endDate, 8, 9)), this.w/9*8, this.textTop, 'middle'),
  this.addTime('24:00', this.w-1, this.textTop, 'end')

  var dayWidth = this.w - (this.dayHOffset * 2);
  this.dayElms = [];
  this.dayLineElms = [];
  this.addDay('mon', this.dayHOffset, this.daysTop, 'middle', 0),
  this.addDay('tues', dayWidth/6*1 + this.dayHOffset, this.daysTop, 'middle', 1),
  this.addDay('wed', dayWidth/6*2 + this.dayHOffset, this.daysTop, 'middle', 2),
  this.addDay('thurs', dayWidth/6*3 + this.dayHOffset, this.daysTop, 'middle', 3),
  this.addDay('fri', dayWidth/6*4 + this.dayHOffset, this.daysTop, 'middle', 4),
  this.addDay('sat', dayWidth/6*5 + this.dayHOffset, this.daysTop, 'middle', 5),
  this.addDay('sun', this.w - this.dayHOffset, this.daysTop, 'middle', 6)

  this.selectDay(null, null, null, this.dayIdx);
}

TimeBar.prototype.dragStartSlider = function(d) {
  var newX = d3.event.dx + parseInt(this.startSlider.attr('mx'));
  var maxX = 0;
  var minX = this.getEndSliderX() - this.sliderMaxGap;
  newX = Math.max(maxX, Math.min(newX, minX));
  this.startSlider.attr('mx', newX)
    .attr('transform', 'translate(' + newX + ',0)')
}

TimeBar.prototype.dragEndSlider = function(d) {
  var newX = parseInt(this.endSlider.attr('mx'), 10) + d3.event.dx;
  var minX = 0;
  var maxX = parseInt(this.startSlider.attr("mx"), 10) - this.w + (this.sliderOffset * 2) + this.sliderMaxGap;
  newX = Math.max(Math.min(minX, newX), maxX);
  this.endSlider.attr('mx', newX)
    .attr('transform', 'translate(' + newX + ',0)');
}

TimeBar.prototype.dragSliderEnd = function() {
  this.bar.attr("x", parseInt(this.startSlider.attr("mx"), 10) + 12);
  this.updateCurrentDate();
}

TimeBar.prototype.getEndSliderX = function() {
  return this.endOrigX + parseInt(this.endSlider.attr('mx'));
}

TimeBar.prototype.getStartSliderX = function() {
  return this.startOrigX + parseInt(this.startSlider.attr('mx'));
}

TimeBar.prototype.updateCurrentDate = function() {
  var x = parseInt(this.startSlider.attr('mx'), 10);
  var x2 = parseInt(this.endSlider.attr('mx'), 10);
  var timeOffset = x/(this.w - this.sliderOffset*2) * 18*60*60*1000;
  var timeEndOffset = 18*60*60*1000 + (x2/(this.w - this.sliderOffset*2) * 18*60*60*1000);
  this.currentDate = new Date(this.minDate.getTime() +  this.dayIdx * 24*60*60*1000 + timeOffset);
  this.currentEndDate = new Date(this.minDate.getTime() +  this.dayIdx * 24*60*60*1000 + timeEndOffset);
}

TimeBar.prototype.addDay = function (day, xOffset, yOffset, anchor, idx) {
  this.dayLineElms.push(this.svg.append("rect")
     .attr("x", xOffset - 20)
     .attr("y", yOffset + 20)
     .attr("width", 40)
     .attr("height", 3)
     .classed("timebar-dayline", true)
  );

  this.dayElms.push(this.svg.append("text")
    .text(day)
    .attr("text-anchor", anchor)
    .classed("timebar-day", true)
    .attr("x", xOffset)
    .attr("y", yOffset)
    .attr("dy", ".71em")
    .on("click", bind(this, this.selectDay, idx))
  );
}

TimeBar.prototype.addTime = function(time, xOffset, yOffset, achor) {
  this.timeElms.push(this.svg.append("text")
    .text(time)
    .attr("text-anchor", achor)
    .attr("x", xOffset)
    .attr("y", yOffset)
    .attr("dy", ".71em")
  );
}

TimeBar.prototype.calculateDate = function(startDate, endDate, seq, max) {
  return new Date(startDate.getTime() + ((endDate.getTime() - startDate.getTime())/max * seq));
}

TimeBar.prototype.selectDay = function(a, b, c, dayIdx) {
  this.svg.selectAll('.timebar-dayline').classed('selected', false);
  this.dayLineElms[dayIdx].classed('selected', true);
  this.dayIdx = dayIdx;
  this.updateCurrentDate();
}

TimeBar.prototype.ready = function() {
  var domain = [timeEventRegistry.getStartDate(), timeEventRegistry.getEndDate()];
  this.duration = (domain[1] - domain[0]) / timeEventRegistry.getMultiplier();
  this.timeEventRegistry
    .register(domain[0], bind(this, this.start), domain[1]);
}

TimeBar.prototype.start = function() {
  this.disable();
  this.bar.transition()
    .duration(this.duration)
    .ease("linear")
    .attr("x", this.getEndSliderX()-this.barHeight/2);
}

TimeBar.prototype.disable = function() {
  this.svg.selectAll('.timebar-day')
    .on("click", null)
    .classed("disabled", true);
  this.svg.selectAll('.timebar-slider')
    .on("mousedown.drag", null)
    .classed("disabled", true);
}

TimeBar.prototype.getDateRange = function() {
  return [this.currentDate, this.currentEndDate];
}