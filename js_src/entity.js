import {DisplaySymbol} from './display_symbol.js';
import {uniqueID} from './util.js';
import {DATASTORE} from './datastore.js';

export class Entity extends DisplaySymbol {
  constructor(templateName, template){
    super(template);
    this.name = template.name || template.templateName || 'no name';
    //this.descr = template.descr || 'boring';

    if (!('attr' in this)) {this.attr = {}; }
    this.attr.id = uniqueID();
    this.attr.templateName = template.name;
    this.attr.x = template.x || 1;
    this.attr.y = template.y || 1;
    this.attr.mapID = '';
  }

  getName(){return this.name;}

  getID(){return this.attr.id;}

  getMapID(){return this.attr.id; }

  setMapID(m) {this.attr.mapID = m;}

  getX(){return this.attr.x;}

  getY() {return this.attr.y;}

  getPos(){return {x: this.attr.x, y: this.attr.y};}

  getxcy() { return `${this.attr.x},${this.attr.y}`; }

  setPos(x, y){
    this.attr.x = x;
    this.attr.y = y;
  }

  setX(x){this.attr.x = x;}

  setY(y){this.attr.y = y;}

  moveBy(dx, dy){
    if (!this.attr.mapID) {
      this.attr.x += dx;
      this.attr.y += dy;
      return true;
    }
    return DATASTORE.MAPS[this.attr.mapID].moveEntityTo(this, this.attr.x + dx, this.attr.y + dy);
  }

  toJSON(){
    return JSON.stringify(this.attr);
  }

  fromJSON(json){
    this.attr = JSON.parse(json);
  }

  fromState(state){
    this.attr = state;
  }
}
