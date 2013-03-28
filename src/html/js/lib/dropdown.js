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

  this.events = new EventRegistry();
  this.setItems(items);

  this.bind("onselect", bind(this, this.changeLabel));
}

DropDown.prototype.changeLabel = function(item, lbl) {
  lbl = lbl || item;
  this.label.text(lbl);
}

DropDown.prototype.bind = function (key, func) {
  this.events.bind(key, func);
}

DropDown.prototype.fire = function (key) {
  this.events.fire(key);
}

DropDown.prototype.setItems = function(items, labelKey, valKey) {
  labelKey = labelKey || "lbl";
  valKey = valKey || "val";
  this.dropdown.selectAll('li').remove();
  this.items = [];
  for(var i=0;i<items.length;i++) {
    this.add(items[i][labelKey], items[i][valKey], items[i])
  }
}

DropDown.prototype.add = function(lbl, val, itemData) {
  var item = this.dropdown.append("li")
    .attr("role", "presentation")
  item.append("a")
    .attr("role", "menuitem")
    .attr("tabindex", "-1")
    .text(lbl)
  item.on("click", bindArr(this.events, this.events.fire, ["onselect", itemData, lbl]));

  this.items.push(item);
}