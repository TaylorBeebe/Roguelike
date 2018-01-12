import {DisplaySymbol} from './display_symbol.js';

export class Tile {
  constructor(name,symbol) {
    this._name = name;
    this._symbol = symbol;
  }
/*
  constructor(template){
    super(template);
    this._name = template.name || 'No Name';
    this.walkable = themplate.walkable || false;
  }
*/
  getDisplaySymbol() {
    return this._symbol;
  }

  getName() {
    return this._name;
  }

  drawOn(display, dispX, dispY) {
    this._symbol.drawOn(display, dispX, dispY);
  }

  isA(matchingTile) {
    return this.getName() == matchingTile.getName();
  }
  /*
  isWalkable(){
    return this.walkable;
  }
  */
}

export let TILES = {
  NULLTILE: new Tile('NULLTILE',new DisplaySymbol()),
  FLOOR: new Tile('FLOOR',new DisplaySymbol('.')),
  WALL: new Tile('WALL',new DisplaySymbol('#'))
}
