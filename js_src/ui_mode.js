import ROT from 'rot-js';
import {makeMap} from './map.js';
import {Color} from './colors.js';
import {DisplaySymbol} from './display_symbol.js';
import {DATASTORE,initializeDatastore} from './datastore.js';

class UIMode {

  constructor(thegame){
    console.log("created " + this.constructor.name);
    this.game = thegame;
    this.display = this.game.getDisplay("main");
    console.log(this.displayId);
  }

  enter(){
    console.log("entering " + this.constructor.name);
  }

  exit(){
    console.log("exiting " + this.constructor.name);
  }

  handleInput(){}
}

export class StartupMode extends UIMode {

  enter(){
    super.enter();
    this.game.messageHandler.send("Welcome to ROGUELIKE GAME NAME");
  }

  render(){
    this.display.drawText(33,4, "Start New Game");
    this.display.drawText(33, 1, "Press any key to advance");
    console.log("rendering StartupMode");
  }

    handleInput(inputType,inputData) {
      if (inputData.charCode !== 0) {
        this.game.switchMode('play');
      }
    }
}

export class PlayMode extends UIMode{
  /*
  enter(){
    if(!this.map){
      this.map = new Map(30,16);
    }
    this.camerax = 5;
    this.cameray = 8;
    this.cameraSymbol = new DisplaySymbol( `@`, `#eb4`);
  }
  */

  enter(){
    super.enter();
    this.game.isPlaying = true;
    this.avatarSymbol = new DisplaySymbol(`@`, `#eb4`);
  }

  newGame(){
    this._STATE_ = {};
    let m = makeMap({xdim: 60, ydim:20});
    this._STATE_.curMapId = m.getId();
    this._STATE_.cameraMapLoc = {
      x: Math.round(m.getXDim()/2),
      y: Math.round(m.getYDim()/2)
    };
    this._STATE_.cameraDisplayLoc = {
      x: Math.round(this.display.getOptions().width/2),
      y: Math.round(this.display.getOptions().height/2)
    };
  }

    render(){
      this.display.clear();
      DATASTORE.MAPS[this._STATE_.curMapId].renderOn(this.display, this._STATE_.cameraMapLoc.x, this._STATE_.cameramMapLoc.y);
      this.avatarSymbol.drawOn(this.display, this._STATE_.cameraDisplayLoc.x, this._STATE_.cameraDisplayLoc.y);
      console.log("rendering PlayMode");
      /*
      this.map.render(display, this.camera_map_x, this.camera_map_y);
      this.cameraSymbol.render(display, display.getOptions().width/2, display.getOptions().height/2);
      */
    }

    handleInput(eventType, inputData){
      if (eventType == 'keyup'){
        if(inputData.key == 'l' || inputData.key == 'L'){
          this.game.switchMode('lose');
        } else if (inputData.key == 'w'|| inputData.key == 'W'){
          this.game.switchMode('win');
        }
        else if (inputData.key == '='){
          this.game.switchMode('persistence')
        }
        else if (inputData.key == '1') {
        this.moveBy(-1,1);
        }
        else if (inputData.key == '2') {
          this.moveBy(0,1);
        }
        else if (inputData.key == '3') {
          this.moveBy(1,1);
        }
        else if (inputData.key == '4') {
          this.moveBy(-1,0);
        }
        else if (inputData.key == '5') {}

        else if (inputData.key == '6') {
          this.moveBy(1,0);
        }
        else if (inputData.key == '7') {
          this.moveBy(-1,-1);
        }
        else if (inputData.key == '8') {
          this.moveBy(0,-1);
        }
        else if (inputData.key == '9') {
          this.moveBy(1,-1);
        }
      }
    }

    moveBy(x, y){
      let newX = this._STATE_.cameraMapLoc.x + x;
      let newY = this._STATE_.cameraMapLoc.y + y;
      if (newX < 0 || newX > DATASTORE.MAPS[this._STATE_.curMapId].getXDim() - 1) { return; }
      if (newY < 0 || newY > DATASTORE.MAPS[this._STATE_.curMapId].getYDim() - 1) { return; }
      this._STATE_.cameraMapLoc.x = newX;
      this._STATE_.cameraMapLoc.y = newY;
      this.render();
    }

    toJSON(){
      return JSON.stringify(this._STATE_);
    }

    fromJSON(json){
      this._STATE_ = JSON.parse(json);
    }
  }

export class WinMode extends UIMode{
  render(){
    this.display.clear();
    this.display.drawText(3,3,"You win!");
  }
}

export class LoseMode extends UIMode{
  render(){
  this.display.clear();
  this.display.drawText(3,3,"You lose!");
  }
}

export class PersistenceMode extends UIMode{

  enter(){
    super.enter();
    if(window.localStorage.getItem(this.game._PERSISTANCE_NAMESPACE)){
      this.game.hasSaved = true;
    }
  }

  render(){
    this.display.clear();
    this.display.drawText(3,3, "N - Start New Game");
    if(this.game.hasSaved){
      this.display.drawText(3, 9, "L - Load A New Game");
    }
    if(this.game.isPlaying){
      this.display.drawText(3, 5, "S - Save Your Current Game");
      this.display.drawText(3, 7, "[Escape] - Cancel/Return To Your Current Game");
    }
  }

  handleInput(inputType,inputData) {

  if (inputType == 'keyup') {
    if (inputData.key == 'n' || inputData.key == 'N') {
      this.game.setupNewGame();
      this.game.messageHandler.send("New game started");
      this.game.switchMode('play');
    }
    else if (inputData.key == 's' || inputData.key == 'S') {
      if (this.game.isPlaying) {
        this.handleSaveGame();
      } else{
        this.game.messageHandler.send("You cannot save game at this time!")
      }
    }
    else if (inputData.key == 'l' || inputData.key == 'L') {
      if (this.game.hasSaved) {
        this.handleLoad();
      } else{
        this.game.messageHandler.send("There are no save games to load!")
      }
    }
    else if (inputData.key == 'Escape') {
      if (this.game.isPlaying) {
        this.game.switchMode('play');
      } else{
        this.game.messageHandler.send("You are not currently playing a game!")
      }
    }
    return false;
  }
}

  handleSave(){
    console.lot('save game');
    if(!this.localStorageAvailable()){return false;}
    window.localStorage.setItem(this.game._PERSISTANCE_NAMESPACE,JSON.stringify(DATASTORE));
    this.game.hasSaved = true;
    this.game.messageHandler.send("Game saved");
    this.game.switchMode('play');
  }

  handleLoad(){
    console.log('load game');
    if (!this.localStorageAvailable()){return false;}

    let restorationString = window.localStorage.getItem(this.game._PERSISTANCE_NAMESPACE);
    let saved__STATE__ = JSON.parse(restorationString);


    initializeDatastore();

    // restore game core
    DATASTORE.GAME = this.game;
    this.game.fromJSON(saved_STATE_.GAME);

    // restore maps (note: in the future might not instantiate all maps here, but instead build some kind of instantiate on demand)
    for (let savedMapId in saved_STATE_.MAPS) {
      makeMap(JSON.parse(saved_STATE_.MAPS[savedMapId]));
    }

    this.game.messageHandler.send("Game loaded");
    this.game.switchMode('play');
    }


  localStorageAvailable() {
  // NOTE: see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  try {
    var x = '__storage_test__';
    window.localStorage.setItem( x, x);
    window.localStorage.removeItem(x);
    return true;
  }
  catch(e) {
    this.game.messageHandler.send('Sorry, no local data storage is available for this browser so game save/load is not possible');
    return false;
  }
}
}
