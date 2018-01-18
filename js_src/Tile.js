import {DisplaySymbol} from './display_symbol.js';

export class Tile extends DisplaySymbol {

  constructor(template){
    super(template);
    this._name = template.name || 'No Name';
    this._walkable = template.walkable || false;
  }

  getDisplaySymbol() {
    return this._symbol;
  }

  getName() {
    return this._name;
  }

  isA(matchingTile) {
    return this.getName() == matchingTile.getName();
  }

  isWalkable(){
    return this._walkable;
  }

}

export let TILES = {
  NULLTILE: new Tile({name: 'NULLTILE', chr: '*', walkable: false}),
  FLOOR: new Tile({name: 'FLOOR', chr: '.', walkable: true}),
  WALL: new Tile({name: 'WALL', chr: '#', walkable: false})
}
