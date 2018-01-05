class UIMode {

  constructor(thegame){
    console.log("created " + this.constructor.name);
    this.game = thegame;
  }

  enter(){
    console.log("entering " + this.constructor.name);
  }

  exit(){
    console.log("exiting " + this.constructor.name);
  }

  handleInput(eventType, evt){
    console.log("handling input for " + this.constructor.name);
    console.log(`event type is ${eventType}`);
    console.dir(evt);
    return false;
  }

  render(display){
    display.drawText(33,4, "Welcome to");
    display.drawText(33,7, "ROGUELIKE GAME NAME");
    display.drawText(33, 1, "Press any key to advance");
    console.log("rendering " + this.constructor.name);
  }

  handleInput(eventType, evt){
    if (eventType == 'keyup'){
      this.game.switchMode('play')
    }
  }
}

export class StartupMode extends UIMode {
  constructor(){
    super();
  }
}

export class PlayMode extends UIMode{
  render(display){
    display.clear();
    display.drawText(3, 3, "Press w to win and l to lose");
  }
}

export class WinMode extends UIMode{
  constructor(){
    super();
  }
}

export class LoseMode extends UIMode{
  constructor(){
    super();
  }
}
