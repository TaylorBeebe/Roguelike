
import ROT from 'rot-js';
import {randomString,init2DArray} from './util.js';
import {TILES} from './tile.js';
import {DATASTORE} from './datastore.js';

class Map{
  constructor(xdim=1,ydim=1,mapType){
    if(!TILE_GRID_GENERATOR.hasOwnProperty(mapType)){
      mapType = 'basicCaves';
    }

    this.attr = {};
    this.attr.xdim = xdim;
    this.attr.ydim = ydim;
    this.attr.mapType = mapType;
    this.attr.id = randomString();
    this.rng = ROT.RNG.clone();
    this.attr.rngBaseState = this.rng.getState();
  }

  setUp(){
    this.rng.setState(this.attr.rngBaseState);
    this.tileGrid = TILE_GRID_GENERATOR[this.attr.mapType](this.attr.xdim, this.attr.ydim, this.attr.rngBaseState);
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

  getTile(x,y) {
    if ((x < 0) || (x >= this.attr.xdim) || (y<0) || (y >= this.attr.ydim)) {
      return TILES.NULLTILE;
    }
    return this.tileGrid[x][y] || TILES.NULLTILE;
  }

  renderOn(display, camX, camY) {
    let o = display.getOptions();
    let xStart = camX-Math.round(o.width/2);
    let yStart = camY-Math.round(o.height/2);
    for (let x=0;x<this.attr.xdim;x++) {
      for (let y=0;y<this.attr.ydim;y++) {
        let tile = this.getTile(x+xStart, y+yStart);
        if (tile.isA(TILES.NULLTILE)) {
          tile = TILES.WALL;
        }
        tile.drawOn(display,x,y);
      }
    }
  }

  toJSON() {
    return JSON.stringify(this.attr);
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

export function makeMap(mapData) {
  let m = new Map(mapData.xdim, mapData.ydim, mapData.mapType);
  if (mapData.id !== undefined) { m.setId(mapData.id); }
  if (mapData.rngBaseState !== undefined) { m.setRngBaseState(mapData.rngBaseState); }
  m.setUp();

  DATASTORE.MAPS[m.getID()] = m;

  return m;
}

//export function mapMaker(mapWidth, mapHeight)

/*
render(display, camera_map_x, camera_map_y){
  let cx=0;
  let cy=0;
  let xstart = camera_map_x - Math.trunc(display.getOptions().width/2);
  let xend = xstart + display.getOptions().width; //{{display.width}}
  let ystart = camera_map_y - Math.trunc(display.getOptions().height/2);
  let yend ystart + display.getOptions().height; //{{display.height}}

  for(let xi = xstart;xi<xend;xi++){
    for(let yi = ystart;yi<yend;yi++){
      this.tileGrid[xi][yi].render(display,cy,cy);
      cy++;
    }
    cx++;
    cy=0;
  }
}

getTile(mapx, mapy){
  if (mapx < 0 || mapx > this.xdim - 1 || mapy < 0 || mapy > this.ydim - 1){
    return TILES>NULLTILE;
  }
  return this.tileGrid[mapx][mapy];
}


let TILE_GRID_GENERATOR = {
  'basic caves': function(xDim,yDim){
    let tg = init2DArray(xDim, yDim, TILES.NULLTILE);
    let gen = new ROT.Map.Cellular(xDim, yDim, {connected: true});
    gen.randomize(0.5);

  }

}
*/
