import ROT from 'rot-js';
import {makeMap} from './map.js';
import {Color} from './colors.js';
import {DisplaySymbol} from './display_symbol.js';
import {DATASTORE,initializeDatastore} from './datastore.js';
import {EntityFactory} from './entities.js';

class UIMode {

  constructor(thegame){
    console.log("created " + this.constructor.name);
    this.game = thegame;
    this.display = this.game.getDisplay("main");
  }

  enter(){
    console.log("entering " + this.constructor.name);
  }

  exit(){
    console.log("exiting " + this.constructor.name);
  }

  renderAvatar(display){
    display.clear();
  }

  handleInput(inputType, inputData){ }
}

export class StartupMode extends UIMode {

  enter(){
    super.enter();
    this.game.messageHandler.send("Welcome to ROGUELIKE GAME NAME");
  }

  render(){
    this.display.drawText(33, 1, "Press any key to advance");
    console.log("rendering StartupMode");
  }



    handleInput(inputType,inputData) {
      if (inputData.charCode !== 0) {
        this.game.switchMode('persistence');
      }
    }
}

export class PlayMode extends UIMode{

  enter(){
    super.enter();
    this.game.isPlaying = true;
  }

  newGame(){
    console.log('creating avatar');
    let a = EntityFactory.create('avatar');
    console.log('avatar created');
    let m = makeMap({xdim: 60, ydim:20});
    a.setPos(m.getUnblockedPerimeterLocation());
    m.addEntity(a);
    this._GAMESTATE_ = {};
    this._GAMESTATE_.avatarId = a.getID();
    this._GAMESTATE_.curMapId = m.getID();
    // console.log(m.getID());
    this._GAMESTATE_.cameraMapLoc = {};
    this.cameraToAvatar();
    this._GAMESTATE_.cameraDisplayLoc = {
      x: Math.round(this.display.getOptions().width/2),
      y: Math.round(this.display.getOptions().height/2)
    };
    // console.log("new game built._GAMESTATE_ dir is-> ");
    // console.dir(this._GAMESTATE_);
  }

    render(){
      this.display.clear();
      if (this.checkGamestate()){ return; }
      // console.log('in PlayMode.render()')
      // console.dir(DATASTORE.MAPS);
      // console.dir(this._GAMESTATE_);
      DATASTORE.MAPS[this._GAMESTATE_.curMapId].renderOn(this.display, this._GAMESTATE_.cameraMapLoc.x, this._GAMESTATE_.cameraMapLoc.y);
      this.game.renderDisplayAvatar();

    }

    checkGamestate(){
      let avatar = this.getAvatar();
      if(!avatar){
        this.game.switchMode('lose');
        return true;
      }
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
        this.move(-1,1);
        }
        else if (inputData.key == '2') {
          this.move(0,1);
        }
        else if (inputData.key == '3') {
          this.move(1,1);
        }
        else if (inputData.key == '4') {
          this.move(-1,0);
        }
        else if (inputData.key == '6') {
          this.move(1,0);
        }
        else if (inputData.key == '7') {
          this.move(-1,-1);
        }
        else if (inputData.key == '8') {
          this.move(0,-1);
        }
        else if (inputData.key == '9') {
          this.move(1,-1);
        }
      }
    }


    renderAvatar(display){
      console.log('in PlayMode.renderAvatar()');
      display.clear();
      display.drawText(0,0, "AVATAR");
      display.drawText(0,2,"Time: " + this.getAvatar().getTime());
      display.drawText(0,4, "HP: " + this.getAvatar().getCurHP());
    }


    move(x, y){
      // console.log('moving avatar');
      // console.dir(this.getAvatar());
      this.getAvatar().tryWalk(x, y);
      this.cameraToAvatar();
      this.render();
    }

    cameraToAvatar(){
      // console.log('centering camera on avatar');
      if(this.getAvatar()){
        this._GAMESTATE_.cameraMapLoc.x = this.getAvatar().getX();
        this._GAMESTATE_.cameraMapLoc.y = this.getAvatar().getY();
      }
      // console.log('camera centered. cameraMapLoc.x : ' + this._GAMESTATE_.cameraMapLoc.x
      // + ' cameraMapLoc.y: ' + this._GAMESTATE_.cameraMapLoc.y);
    }

    toJSON(){
      return JSON.stringify(this._GAMESTATE_);
    }

    fromJSON(json){
      this._GAMESTATE_ = JSON.parse(json);
    }

    getAvatar(){
      if (this._GAMESTATE_.avatarId) { return DATASTORE.ENTITIES[this._GAMESTATE_.avatarId]; }
      else {
        console.log('avatar not available! cannot fetch avatar reference!')
        return false;
      }
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
      this.display.drawText(3, 9, "L - Load Your Previous Save");
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
        this.handleSave();
        this.game.messageHandler.send("Game saved");
        this.game.switchMode('play');
      }
    }
    else if (inputData.key == 'l' || inputData.key == 'L') {
      if (this.game.hasSaved) {
        this.handleLoad();
        this.game.messageHandler.send("Game loaded");
        this.game.switchMode('play');
      }
    }
    else if (inputData.key == 'Escape') {
      if (this.game.isPlaying) {
        this.game.switchMode('play');
      }
    }
    return false;
  }
}

  handleSave(){
    console.log('saving game');
    if(!this.localStorageAvailable()){return false;}
    window.localStorage.setItem(this.game._PERSISTANCE_NAMESPACE,JSON.stringify(DATASTORE));
    this.game.hasSaved = true;

  }

  handleLoad(){
    console.log('load game');
    if (!this.localStorageAvailable()){return false;}

    let restorationString = window.localStorage.getItem(this.game._PERSISTANCE_NAMESPACE);
    let saved_GAMESTATE_ = JSON.parse(restorationString);

    initializeDatastore();
    // console.log('datastore initialized');
    // restore game core
    DATASTORE.GAME = this.game;
    this.game.fromJSON(saved_GAMESTATE_.GAME);
    console.log('restoring maps');
    // restore maps (note: in the future might not instantiate all maps here, but instead build some kind of instantiate on demand)
    for (let savedMapId in saved_GAMESTATE_.MAPS) {
      makeMap(JSON.parse(saved_GAMESTATE_.MAPS[savedMapId]));
      // console.log('map restored-> ');
      // console.log(savedMapId);
    }
    console.log('all maps restored');

    //CHECK ACCURATE VARIABLE NAMES
    console.log('loading entities');
    for (let savedEntityId in saved_GAMESTATE_.ENTITIES){
      let entState = JSON.parse(saved_GAMESTATE_.ENTITIES[savedEntityId]);
      EntityFactory.create(entState.templateName, entState);
    }
    console.log('all entities loaded');
    console.log('game loaded! DATASTORE -> ')
    console.dir(DATASTORE);

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
