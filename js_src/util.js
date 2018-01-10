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
  var a = [];
  for (var xdim=0; xdim < x; xdim++) {
    a.push([]);
    for (var ydim=0; ydim < y; ydim++) {
      a[xdim].push(initVal);
    }
  }
  return a;
}
/*
let randStringCharSource = ''.split('');
export functions uniqueId(tag){
  let id = '';
  for (let i=1;i<4;i++){
    id += randStringCharSource.random();
  }
  id = `${tag ? tag + `-`}`
}
*/
