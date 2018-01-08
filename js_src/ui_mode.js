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

  // handleInput(eventType, evt){
  //   console.log("handling input for " + this.constructor.name);
  //   console.log(`event type is ${eventType}`);
  //   console.dir(evt);
  //   return false;
  // }
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
    render(){
      this.display.clear();
      this.display.drawText(3, 3, "Press w to win and l to lose");
      console.log("rendering PlayMode");
    }

    handleInput(eventType, inputData){
      if(eventType == 'keyup' && inputData.key == 'l' || inputData.key == 'L'){
      this.game.switchMode('lose');
    } else if (eventType == 'keyup' && inputData.key == 'w'|| inputData.key == 'W'){
      this.game.switchMode('win');
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


  handleInput(inputType,inputData) {
  // super.handleInput(inputType,inputData);
  if (inputType == 'keyup') {
    if (inputData.key == 'n' || inputData.key == 'N') {
      this.game.startNewGame();
      Message.send("New game started");
      this.game.switchMode('play');
    }
    else if (inputData.key == 's' || inputData.key == 'S') {
      if (this.game.isPlaying) {
        this.handleSaveGame();
      }
    }
    else if (inputData.key == 'l' || inputData.key == 'L') {
      if (this.game.hasSaved) {
        this.handleLoad();
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
    Message.send('Sorry, no local data storage is available for this browser so game save/load is not possible');
    return false;
  }
}
}
