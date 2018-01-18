import {Color} from './colors.js';

export class DisplaySymbol {

  constructor(template){
    console.log
    console.dir(template);
    this._chr = template.chr || ' ';
    this._fgHexColor = template.fg || Color.FG;
    this._bgHexColor = template.bg || Color.BG;
  }


  getRepresentation() {
    return '%c{' + this._fgHexColor + '}%b{' + this._bgHexColor + '}' + this._chr;
  }

  drawOn(display, dispX, dispY) {

    // console.log('entering display_symbol.drawOn(). x: ' + dispX + ", y: " + dispY);
    // console.dir(this._chr);
    display.draw(dispX, dispY, this._chr, this._fgHexColor, this._bgHexColor);
  }
}
