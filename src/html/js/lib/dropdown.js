DropDown = function(elm, items, label) {
  this.container = elm.append("li")
    .classed("dropdown", true);
  this.label = this.container.append("a")
    .attr("role", "buton")
    .classed("dropdown-toggle", true)
    .attr("data-toggle", "dropdown")
    .text(label)
  this.label.append("b")
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
}

DropDown.prototype.bind = function (key, func) {
  this.events.bind(key, func);
}

DropDown.prototype.add = function(lbl, val) {
  var item = this.dropdown.append("li")
    .attr("role", "presentation")
  item.append("a")
    .attr("role", "menuitem")
    .attr("tabindex", "-1")
    .attr("href", val)
    .text(lbl)
  this.items.push(item);
}