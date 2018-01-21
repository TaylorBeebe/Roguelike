
import ROT from 'rot-js';
import {uniqueID,init2DArray} from './util.js';
import {TILES} from './tile.js';
import {DATASTORE} from './datastore.js';

class Map{
  constructor(xdim=1,ydim=1,mapType, visibilityRange){
    if(!TILE_GRID_GENERATOR.hasOwnProperty(mapType)){
      mapType = 'basicCaves';
    }
    console.log('entering map.constructor()');

    this.attr = {};
    this.attr.xdim = xdim;
    this.attr.ydim = ydim;
    this.attr.mapType = mapType;
    this.attr.id = uniqueID();
    this.rng = ROT.RNG.clone();
    this.attr.rngBaseState = this.rng.getState();
    this.attr.locationToEntityID = {};
    this.attr.entityIDToLocation = {};
    this.attr.visibilityRange =  visibilityRange;
    this.attr.lastSeenGrid = {};
    // console.dir(this.attr);
    console.log('exiting map.constructor()');

  }

  setUp(){
    this.rng.setState(this.attr.rngBaseState);
    this.tileGrid = TILE_GRID_GENERATOR[this.attr.mapType](this.attr.xdim, this.attr.ydim, this.attr.rngBaseState);
    // console.log('Tile Grid -> ');
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
    // console.dir(ent);
    ent.setMapID(this.attr.id);
    // console.dir(this.attr.entityIDToLocation);
    this.attr.entityIDToLocation[ent.getID()] = ent.getxcy();
    this.attr.locationToEntityID[ent.getxcy()] = ent.getID();
   }


  removeEntity(ent){
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
    // console.log('entity can move to this location. moving...')
    delete this.attr.locationToEntityID[ent.getxcy()];
    ent.setPos(x, y);
    this.attr.locationToEntityID[ent.getxcy()] = ent.getID();
    this.attr.entityIDToLocation[ent.getID()] = ent.getxcy();
    // console.dir(this.attr);
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

  // renderOn(display, camX, camY) {
  //
  //   // var fov = new ROT.FOV.PreciseShadowcasting(lightPasses(camX, camY));
  //   //console.log('camX: ' + camX + ' camY: ' + camY);
  //   let o = display.getOptions();
  //   let xStart = camX-Math.round(o.width/2);
  //   let yStart = camY-Math.round(o.height/2);
  //   // console.log('xStart: ' + xStart + ' yStart: ' + yStart);
  //   for (let x=0;x<o.width;x++) {
  //     for (let y=0;y<o.height;y++) {
  //       // console.log(Math.abs(Math.sqrt(Math.pow(camX - x, 2) + Math.pow(camY - y, 2))));
  //       // console.log('camX = ' + camX + ' curx = ' + x + ' camY = ' + camY + ' cury = ' + y);
  //       let tile = this.getDisplaySymbolAtMapLocation(x+xStart, y+yStart);
  //
  //       } else {
  //         if ((x+xStart < 0) || (x+xStart >= this.attr.xdim) || (y+yStart < 0) || (y+yStart >= this.attr.ydim)) {
  //           let tile = TILES.NULLTILE;
  //         } else {
  //         let tile = this.lastSeenGrid[x+xStart][y+yStart];
  //       } }
  //       tile.drawOn(display, x, y);
  //     }
  //   }
  // }

  renderOn(display, camX, camY) {
   //console.log('camX: ' + camX + ' camY: ' + camY);
   let o = display.getOptions();
   let xStart = camX-Math.round(o.width/2);
   let yStart = camY-Math.round(o.height/2);
   let xIndex = 0;
   let yIndex = 0;
   let m = this.getID();

   var lightPasses = function(x, y) {
     if (DATASTORE.MAPS[m].getTile(x, y).isOpaque()){
       // console.log('light passes through: ' + DATASTORE.MAPS[m].getTile(x, y).getName());
       return true;
     }
     // console.log('light does not pass through: ' +  DATASTORE.MAPS[m].getTile(x, y).getName());
     return false;
   }
   let visibleTiles = {};
   // console.log('xStart: ' + xStart + ' yStart: ' + yStart);
   let fov = new ROT.FOV.RecursiveShadowcasting(lightPasses);

   // console.log(DATASTORE.MAPS[m].attr);
   fov.compute(camX, camY, DATASTORE.MAPS[m].attr.visibilityRange, function(x, y, r, visibility){
     // console.log('in fov.compute');
     // console.log(x, y)
     visibleTiles[`${x},${y}`] = true;
     DATASTORE.MAPS[m].attr.lastSeenGrid[`${x},${y}`] = DATASTORE.MAPS[m].getDisplaySymbolAtMapLocation(x, y);
   })

   for (let x=0;x<o.width;x++) {
     xIndex = x + xStart;
     for (let y=0;y<o.height;y++) {
       yIndex = y + yStart;
       if (!((xIndex < 0) || (xIndex >= this.attr.xdim) || (yIndex < 0) || (yIndex >= this.attr.ydim))){
         // console.log(`${xIndex}, ${yIndex}`);
         // console.log(visibleTiles[`${xIndex}, ${yIndex}`]);
         if (!visibleTiles[`${xIndex},${yIndex}`]){
           // console.log('tile being rendered is not visible');
           // console.log(DATASTORE.MAPS[m].attr.lastSeenGrid[`${xIndex}, ${yIndex}`]);
           // console.log(this.attr.lastSeenGrid[`${xIndex}`][`${yIndex}`]);
           // console.log(`${xIndex},${yIndex}`);
           if(this.attr.lastSeenGrid[`${xIndex},${yIndex}`]){
             // console.log('tile being rendered has been seen before');
             this.attr.lastSeenGrid[`${xIndex},${yIndex}`].drawOnGrey(display,x,y);
           }
         } else {
           this.getDisplaySymbolAtMapLocation(x+xStart, y+yStart).drawOn(display,x,y);
         }
       }
     }
   }
   // console.log('Visible tiles -> ');
   // console.dir(visibleTiles);
   // console.log('Last seen grid ->');
   // console.dir(this.attr.lastSeenGrid);
 }

  getDisplaySymbolAtMapLocation(mapX,mapY) {
    // console.log('in getDisplaySymbolAtMapLocation -> ' + mapX + ', ' + mapY);
    // console.log('creating entityid in map.getDisplaySymbolAtMapLocation()');
    // console.dir(this.attr);
    // console.dir(this.attr.locationToEntityID);
    let entityId = this.attr.locationToEntityID[`${mapX},${mapY}`];
    // console.dir(entityId);
    if (entityId) {
      // console.log('entity at this location: ' + mapX + ', ' + mapY);
      return DATASTORE.ENTITIES[entityId];
    }
    let tile = this.getTile(mapX, mapY);
    return tile;
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
    gen.randomize(.4);
    for(let i = 0; i <= 3; i++) {
      gen.create();
      for (let x = 0; x < xdim; x++) {
        for (let y = 0; y < ydim; y++) {
          if (x <= 1 || y <= 1 || x >= xdim - 2 || y >= ydim - 2) {
            gen.set(x, y, 1);
          } } } }
    gen.connect(function(x,y,isWall) {
      tg[x][y] = (isWall || x==0 || y==0 || x==xdim-1 || y==ydim-1) ? TILES.WALL : TILES.FLOOR;
    });
    // ROT.RNG.setState(origRngState);
    return tg;
  }
}

export function makeMap(mapData) {
  if (mapData.mapType == 'basicCaves' || !mapData.mapType){
    mapData.visibilityRange = 10;
  }
  let m = new Map(mapData.xdim, mapData.ydim, mapData.mapType, mapData.visibilityRange);
  if (mapData.id !== undefined) { m.attr = mapData; }
  m.setUp();
  DATASTORE.MAPS[m.getID()] = m;
  return m;
}

// export function lightPasses(x,  y) {
//   if (this.getTile(x, y).isOpaque()){
//     return true;
//   }
//   return false;
// }
