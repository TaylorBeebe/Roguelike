import {DisplaySymbol} from './display_symbol.js';

export class Tile extends DisplaySymbol {
  // constructor(name,symbol) {
  //   this._name = name;
  //   this._symbol = symbol;
  // }

  constructor(template){
    super(template);
    this._name = template.name || 'No Name';
    this._walkable = template.walkable || false;
    // this.transparent = template.transparent || false;
  }

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

  isWalkable(){
    return this._walkable;
  }

}

export let TILES = {
  NULLTILE: new Tile({name: 'NULLTILE'}),
  FLOOR: new Tile({name: 'FLOOR', chr: '.', walkable: true}),
  WALL: new Tile({name: 'WALL', chr: '#'})
}

// export let TILES = {
//   NULLTILE: new Tile('NULLTILE',new DisplaySymbol()),
//   FLOOR: new Tile('FLOOR', new DisplaySymbol('.')),
//   WALL: new Tile('WALL',new DisplaySymbol('#'))
// }
