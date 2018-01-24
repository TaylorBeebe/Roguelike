//unecessary to import once mixable symbol implemented
// import {DisplaySymbol} from './display_symbol.js';
import {uniqueID} from './util.js';
import {DATASTORE} from './datastore.js';
import {MixableSymbol} from './mixable_symbol.js'

export class Entity extends MixableSymbol {
  constructor(templateName, template){
    super(template);
    this.name = template.name || template.templateName || 'no name';
    this.descr = template.descr || 'none';

    if (!('attr' in this)) {this.attr = {}; }
    this.attr.id = uniqueID();
    this.attr.templateName = template.name;
    this.attr.x = template.x || 1;
    this.attr.y = template.y || 1;
    this.attr.mapID = '';
    this.isDestroyed = false;
    this.expGainedForKill = template.expGainedForKill || 0;
    // this.attr.isAgressive = template.isAgressive || false;
    // this.attr.inLineOfSightOfPlayer = false;
  }

  getName(){return this.name;}

  getID(){return this.attr.id;}

  getMapID(){return this.attr.id; }

  setMapID(m) {this.attr.mapID = m;}

  getX(){return this.attr.x;}

  getY() {return this.attr.y;}

  getPos(){return {x: this.attr.x, y: this.attr.y};}

  getxcy() { return `${this.attr.x},${this.attr.y}`; }

  getMap() { return DATASTORE.MAPS[this.attr.mapID]; }

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

  toJSON(){
    return JSON.stringify(this.attr);
  }

  fromJSON(json){
    this.attr = JSON.parse(json);
  }

  fromState(state){
    this.attr = state;
  }

  destroy() {
  this.getMap().removeEntity(this);
  delete DATASTORE.ENTITIES[this.getID()];
  this.isDestroyed = true;
  }
}
