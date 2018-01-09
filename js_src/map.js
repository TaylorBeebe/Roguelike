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
  'basic caves': function(xd,yd){
    let tg = init2DArray(xdim, ydim, TILES.NULLTILE);
    let gen = new ROT.map

  }

}
*/
