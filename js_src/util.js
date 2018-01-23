import {Color} from './colors.js';

let randCharSource = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
export function randomString(len = 8) {
  var res='';
    for (var i=0; i<len; i++) {
        res += randCharSource.random();
    }
    //res =  `${DATASTORE.ID_SEQ} - ${res}`
    return res;
}

export function init2DArray(x=1,y=1,initVal='') {
  // console.log('initializing 2D Array');
  var a = [];
  for (var xdim=0; xdim < x; xdim++) {
    a.push([]);
    for (var ydim=0; ydim < y; ydim++) {
      a[xdim].push(initVal);
    }
  }
  // console.log(a);
  return a;
}

export function getColor(attackType){
  if (attackType == 'Strength'){
    return Color.STRENGTH;
  } else if (attackType == 'Intelligence'){
    return Color.INTELLIGENCE
  } else if (attackType == 'Agility'){
    return Color.AGILITY;
  }
  return;
}

let ID_SEQ = 0;
export function uniqueID() {
  ID_SEQ++;
  return `${ID_SEQ}-${randomString()}`;
}
