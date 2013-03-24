DropDown = function(elm, items, label) {
  this.container = elm.append("li")
    .classed("dropdown", true);
  var e1 = this.container.append("a")
    .attr("role", "buton")
    .classed("dropdown-toggle", true)
    .attr("data-toggle", "dropdown")
  this.label = e1.append("span")
    .text(label);
  e1.append("b")
    .classed("caret", true)
    .attr("id", "drop1");
  this.dropdown = this.container.append("ul")
    .classed("dropdown-menu", true)
    .attr("role", "menu")
    .attr("aria-labelledby", "drop1");

  this.items = [];
  this.events = new EventRegistry();
  for(var i=0;i<items.length;i++) {
    this.add(items[i].lbl, items[i].val)
  }
  this.bind("onselect", bind(this, this.changeLabel));
}

DropDown.prototype.changeLabel = function(lbl) {
  this.label.text(lbl);
}

DropDown.prototype.bind = function (key, func) {
  this.events.bind(key, func);
}

DropDown.prototype.fire = function (key) {
  this.events.fire(key);
}



DropDown.prototype.add = function(lbl, val) {
  var item = this.dropdown.append("li")
    .attr("role", "presentation")
  item.append("a")
    .attr("role", "menuitem")
    .attr("tabindex", "-1")
    .text(lbl)
  item.on("click", bindArr(this.events, this.events.fire, ["onselect", lbl, val]));

  this.items.push(item);
}