//unecessary to import once mixable symbols are implemented
import {DisplaySymbol} from './display_symbol.js';
import {uniqueID} from './util.js';
import {DATASTORE} from './datastore.js';
// import {MixableSymbol} from './mixable_symbol.js'

//should extend mixable symbol next -> extends MixableSymbol

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

  setPos(x_or_xy,y) {
  if (typeof x_or_xy == 'object') {
    this.attr.x = x_or_xy.x;
    this.attr.y = x_or_xy.y;
  } else {
    this.attr.x = x_or_xy;
    this.attr.y = y;
    }
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
