

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

    render(){
      this.display.drawText(33,4, "Welcome to");
      this.display.drawText(33,7, "ROGUELIKE GAME NAME");
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

    render(){
      this.display.clear();
      this.display.drawText(3, 3, "Press w to win and l to lose and = for persistence");
      console.log("rendering PlayMode");
      /*
      this.map.render(display, this.camera_map_x, this.camera_map_y);
      this.cameraSymbol.render(display, display.getOptions().width/2, display.getOptions().height/2);
      */
    }

    handleInput(eventType, inputData){
      if(eventType == 'keyup' && inputData.key == 'l' || inputData.key == 'L'){
        this.game.switchMode('lose');
      } else if (eventType == 'keyup' && inputData.key == 'w'|| inputData.key == 'W'){
        this.game.switchMode('win');
      }
      else if (eventType == 'keyup' && inputData.key == '='){
        this.game.switchMode('persistence')
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

  render(){
    this.display.clear();
    this.display.drawText(3,3, "Press n for new game, s for save game, l for load game, escape to go back to your game")
  }

  handleInput(inputType,inputData) {
  // super.handleInput(inputType,inputData);
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
    window.localStorage.setItem('ROGUELIKE', this.game.toJSON());
  }

  handleLoad(){
    console.log('load game');
    if (!this.localStorageAvailable()){return false;}

    let restorationString = window.localStorage.getItem('ROGUELIKE');
    this.game.fromJSON(restorationString);
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
