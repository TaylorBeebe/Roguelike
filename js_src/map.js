
import ROT from 'rot-js';
import {uniqueID,init2DArray} from './util.js';
import {TILES} from './tile.js';
import {DATASTORE} from './datastore.js';

class Map{
  constructor(xdim=1,ydim=1,mapType){
    if(!TILE_GRID_GENERATOR.hasOwnProperty(mapType)){
      mapType = 'basicCaves';
    }
    console.log('in map constructor()');

    this.attr = {};
    this.attr.xdim = xdim;
    this.attr.ydim = ydim;
    this.attr.mapType = mapType;
    this.attr.id = uniqueID();
    this.rng = ROT.RNG.clone();
    this.attr.rngBaseState = this.rng.getState();
    this.attr.locationToEntityID = {};
    this.attr.entityIDToLocation = {};
    console.dir(this.attr);
    console.log('exiting map constructor()');

  }

  setUp(){
    this.rng.setState(this.attr.rngBaseState);
    this.tileGrid = TILE_GRID_GENERATOR[this.attr.mapType](this.attr.xdim, this.attr.ydim, this.attr.rngBaseState);
    // console.log('Tile Grid:')
    // console.dir(this.tileGrid);
  }

  getID(){
    return this.attr.id;
  }

  setID(id){
    this.attr.id = id;
  }

  getRngBaseState() {
    return this.attr.rngBaseState;
  }

  setRngBaseState(newRngBaseState) {
     this.attr.rngBaseState = newRngBaseState;
  }

  getXDim() {
    return this.attr.xdim;
  }

  getYDim() {
     return this.attr.ydim;
  }

  addEntity(ent) {
    console.dir(ent);
     ent.setMapID(this.attr.id);
     console.dir(this.attr.entityIDToLocation);
     this.attr.entityIDToLocation[ent.getID()] = ent.getxcy();
     this.attr.locationToEntityID[ent.getxcy()] = ent.getID();
   }


  removeEntitiy(ent){
    ent.setMapID('');
    delete this.attr.entityIDToLocation[ent.getID()];
    delete this.attr.locationToEntityID[ent.getPos()];
  }

  moveEntityTo(ent, x, y){
    if ((x < 0) || (x >= this.attr.xdim) || (y < 0) || (y >= this.attr.ydim)) {
      return false;
    }
    if (this.testLocationBlocked(x,y)){
      console.log('position is blocked [map.moveEntityTo()]');
      return false;
    }
    console.log('entity can move to this location. moving...')
    delete this.attr.locationToEntityID[ent.getxcy()];
    ent.setPos(x, y);
    this.attr.locationToEntityID[ent.getxcy()] = ent.getID();
    this.attr.entityIDToLocation[ent.getID()] = ent.getxcy();
    console.dir(this.attr);
    return true;
  }

  getRandomUnblockedPosition(){
    let rx = Math.trunc(this.rng.getUniform()*this.attr.xdim);
    let ry = Math.trunc(this.rng.getUniform()*this.attr.ydim);
    if (this.testLocationBlocked(rx, ry)){
      return this.getRandomUnblockedPosition();
    }
    return {x: rx, y: ry};
  }

  getUnblockedPerimeterLocation(inset) {
    inset = inset || 2;
    let bounds = {
      lx: inset,
      ux: this.attr.xdim-1-inset,
      ly: inset,
      uy: this.attr.ydim-1-inset
    };
    let range = {
      rx: this.attr.xdim-1-inset-inset,
      ry: this.attr.ydim-1-inset-inset
    };
    let [x,y] = [0,0];
    if (this.rng.getUniform() < .5) {
      x = this.rng.getUniform() < .5 ? bounds.lx : bounds.ux;
      y = Math.trunc(this.rng.getUniform() * range.ry);
    } else {
      x = Math.trunc(this.rng.getUniform() * range.rx);
      y = this.rng.getUniform() < .5 ? bounds.ly : bounds.uy;
    }

    let perimLen = range.rx * 2 + range.ry * 2 - 4;
    for (let i=0; i<perimLen; i++) {
      if (! this.testLocationBlocked(x,y)) {
        return {'x': x, 'y': y};
      }
      if (y==bounds.ly && x < bounds.ux) { x++; continue; }
      if (x==bounds.ux && y < bounds.uy) { y++; continue; }
      if (y==bounds.uy && x > bounds.lx) { x--; continue; }
      if (x==bounds.lx && y > bounds.ly) { y--; continue; }
    }
    return this.getUnblockedPerimeterLocation(inset+1);
  }


  testLocationBlocked(x, y) {
    return (this.attr.locationToEntityID[`${x}, ${y}`] || !this.getTile(x, y).isWalkable());
  }

  getTile(x,y) {
    // console.log('x: ' + x + " y: " + y);
    if ((x < 0) || (x >= this.attr.xdim) || (y < 0) || (y >= this.attr.ydim)) {
      // console.log('Tile out of bounds');
      return TILES.NULLTILE;
    }
    // console.dir(this.tileGrid[x][y]);
    return this.tileGrid[x][y] || TILES.NULLTILE;
  }

  renderOn(display, camX, camY) {
    //console.log('camX: ' + camX + ' camY: ' + camY);
    let o = display.getOptions();
    let xStart = camX-Math.round(o.width/2);
    let yStart = camY-Math.round(o.height/2);
    // console.log('xStart: ' + xStart + ' yStart: ' + yStart);
    for (let x=0;x<o.width;x++) {
      for (let y=0;y<o.height;y++) {
        // let tile = this.getTile(x+xStart, y+yStart);
        // if (tile.isA(TILES.NULLTILE)) {
        //   tile = TILES.WALL;
        this.getDisplaySymbolAtMapLocation(x+xStart, y+yStart).drawOn(display,x,y);
        }
        // console.log(camX + ", " + camY);
        // console.dir(tile);
        //tile.drawOn(display,x,y);
      }
    }


  getDisplaySymbolAtMapLocation(mapX,mapY) {
    // console.log('creating entityid in map.getDisplaySymbolAtMapLocation()');
    // console.dir(this.attr);
    // console.dir(this.attr.locationToEntityID);
    let entityId = this.attr.locationToEntityID[`${mapX},${mapY}`];
    // console.dir(entityId);
    if (entityId) {
      console.log('entity at this location: ' + mapX + ', ' + mapY);
      return DATASTORE.ENTITIES[entityId];
    }

    let tile = this.getTile(mapX, mapY);
    if (tile.isA(TILES.NULLTILE)) {
      tile = TILES.WALL;
    }
    return tile;
  }

  toJSON() {
    return JSON.stringify(this.attr);
  }

  fromState(mapData){
    console.log('creating map from data');
    console.dir(mapData);
    this.attr = mapData;
  }

}

let TILE_GRID_GENERATOR = {
  basicCaves: function(xdim,ydim,rngState) {
    let origRngState = ROT.RNG.getState();
    ROT.RNG.setState(rngState);
    let tg = init2DArray(xdim,ydim,TILES.NULLTILE);
    let gen = new ROT.Map.Cellular(xdim, ydim, { connected: true });
    gen.randomize(.5);
    for(let i=3;i>=0;i--) {
      gen.create();
      // set the boundary to all wall each pass
      for (let x=0;x<xdim;x++) {
        for (let y=0;y<ydim;y++) {
          if (x<=1 || y<=1 || x>=xdim-2 || y>=ydim-2) {
            gen.set(x,y,1);
          } } } }
    gen.connect(function(x,y,isWall) {
      tg[x][y] = (isWall || x==0 || y==0 || x==xdim-1 || y==ydim-1) ? TILES.WALL : TILES.FLOOR;
    });
    ROT.RNG.setState(origRngState);
    return tg;
  }
}

/*
getRandomOpenPosition(){
  let x = Math.trunc(ROT.RNG.getUniform()*this.state.xdim);
  let y = Math.trunc(ROT.RNG.getUniform()*this.state.ydim);

  if (this.tileGrid[x][y].isA('floor')){
    return `${x},${y}`;
  }
  return this.getRandomOpenPosition();
}
*/

export function makeMap(mapData) {
  let m = new Map(mapData.xdim, mapData.ydim, mapData.mapType);
  // if (mapData.id !== undefined) { m.setID(mapData.id); }
  // if (mapData.rngBaseState !== undefined) { m.setRngBaseState(mapData.rngBaseState); }
  if (mapData.id !== undefined) {
  m.fromState(mapData);
  }
  m.setUp();

  DATASTORE.MAPS[m.getID()] = m;

  return m;
}
