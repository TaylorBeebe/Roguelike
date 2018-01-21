import {Color} from './colors.js';

export class DisplaySymbol {

  constructor(template){
    // console.log('In DisplaySymbol.constructor()');
    // console.dir(template);
    this._chr = template.chr || ' ';
    this._fgHexColor = template.fg || Color.FG;
    this._bgHexColor = template.bg || Color.BG;
  }


  getRepresentation() {
    return '%c{' + this._fgHexColor + '}%b{' + this._bgHexColor + '}' + this._chr;
  }

  drawOn(display, dispX, dispY) {
    display.draw(dispX, dispY, this._chr, this._fgHexColor, this._bgHexColor);
  }

  drawOnGrey(display, dispX, dispY){
    display.draw(dispX, dispY, this._chr, Color.GREYFG, this._bgHexColor);
  }

}
