import ROT from 'rot-js';
import {makeMap} from './map.js';
import {Color} from './colors.js';
import {DisplaySymbol} from './display_symbol.js';
import {DATASTORE,initializeDatastore} from './datastore.js';
import {EntityFactory} from './entities.js';
import {Messenger} from './messenger.js';

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
    this.game.messageHandler.send("Welcome to Cave Crawler!");
  }

  render(){
    this.display.drawText(2,5, '   ______     ______     __   __   ______ ');
    this.display.drawText(1,6, '  /\\  ___\    /\\  __ \\   /\\ \\ / /  /\\  ___\\');
    this.display.drawText(1,7, '  \\ \\ \\____  \\ \\  __ \\  \\ \\ \\\'/   \\ \\  __\\');
    this.display.drawText(2,8, '   \\ \\_____\\  \\ \\_\\ \\_\\  \\ \\__|    \\ \\_____\\ ');
    this.display.drawText(3,9, '    \\/_____/   \\/_/\\/_/   \\/_/      \\/_____/')
    this.display.drawText(2,10, '   ______     ______     ______     __     __     __         ______     ______');
    this.display.drawText(1,11, '  /\\  ___\\   /\\  == \\   /\\  __ \\   /\\ \\  _ \\ \\   /\\ \\       /\\  ___\\   /\\  == \\');
    this.display.drawText(1,12, '  \\ \\ \\____  \\ \\  __<   \\ \\  __ \\  \\ \\ \\/ ".\\ \\  \\ \\ \\____  \\ \\  __\\   \\ \\  __<');
    this.display.drawText(2,13, '   \\ \\_____\\  \\ \\_\\ \\_\\  \\ \\_\\ \\_\\  \\ \\__/".~\\_\\  \\ \\_____\\  \\ \\_____\\  \\ \\_\\ \\_\\ ');
    this.display.drawText(3,14, '    \\/_____/   \\/_/ /_/   \\/_/\\/_/   \\/_/   \\/_/   \\/_____/   \\/_____/   \\/_/ /_/ ');
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
    for (let x = 0; x < 5; x++){
      let b = EntityFactory.create('ogre');
      b.setPos(m.getRandomUnblockedPosition());
      m.addEntity(b);
    }
    this._GAMESTATE_ = {};
    this._GAMESTATE_.avatarId = a.getID();
    this._GAMESTATE_.curMapId = m.getID();
    this._GAMESTATE_.cameraMapLoc = {};
    this.cameraToAvatar();
    this._GAMESTATE_.cameraDisplayLoc = {
      x: Math.round(this.display.getOptions().width/2),
      y: Math.round(this.display.getOptions().height/2)
    };
  }


  render(){
    this.display.clear();
    if (this.checkGamestate()){ return; }
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
      } else if (inputData.key == '='){
        this.game.switchMode('persistence');
      } else if (inputData.key == '1') {
        this.move(-1,1);
      } else if (inputData.key == '2') {
        this.move(0,1);
      } else if (inputData.key == '3') {
        this.move(1,1);
      } else if (inputData.key == '4') {
        this.move(-1,0);
      } else if (inputData.key == '6') {
        this.move(1,0);
      } else if (inputData.key == '7') {
        this.move(-1,-1);
      } else if (inputData.key == '8') {
        this.move(0,-1);
      } else if (inputData.key == '9') {
        this.move(1,-1);
      } else if (inputData.key == '-'){
        this.game.switchMode('levelup');
      } else{
        return false;
      } return true;
    }
  }

  renderAvatar(display){
    // console.log('in PlayMode.renderAvatar()');
    display.clear();
    display.drawText(0,0, "AVATAR");
    display.drawText(0,2,"Time: " + this.getAvatar().getTime());
    display.drawText(0,4, `${Color.HP}HP${Color.DEFAULT}: ` + this.getAvatar().getCurHP());

    display.drawText(0,6, `${Color.STRENGTH}Str${Color.DEFAULT}: ` + this.getAvatar().getStats().strength);
    display.drawText(0,8, `${Color.INTELLIGENCE}Int${Color.DEFAULT}: ` + this.getAvatar().getStats().intelligence);
    display.drawText(0,10, `${Color.AGILITY}Agil${Color.DEFAULT}: ` + this.getAvatar().getStats().agility);
    display.drawText(0,12, `${Color.EXP}Exp${Color.DEFAULT}: ` + this.getAvatar().getExp());
  }


  move(x, y){
    this.getAvatar().tryWalk(x, y);
    this.cameraToAvatar();
    }

  cameraToAvatar(){
    if(this.getAvatar()){
      this._GAMESTATE_.cameraMapLoc.x = this.getAvatar().getX();
      this._GAMESTATE_.cameraMapLoc.y = this.getAvatar().getY();
    }
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

export class AttackMode extends UIMode{

  enter(evtData){
    this.evtData = evtData;
  }

  exit(){
    super.exit();
  }

  render(){
    let display = this.game.getDisplay('main')
    display.clear();
    display.drawText(3, 3, `${Color.DEFAULT} Press 1 to attempt a ${Color.STRENGTH}Strength${Color.DEFAULT} attack`);
    display.drawText(3, 5, `${Color.DEFAULT} Press 2 to attempt an ${Color.INTELLIGENCE}Intelligence${Color.DEFAULT} attack`);
    display.drawText(3, 7, `${Color.DEFAULT} Press 3 to attempt an ${Color.AGILITY}Agility${Color.DEFAULT} attack`);
    console.dir(DATASTORE);
  }

  handleInput(inputType,inputData) {
    if (inputType == 'keyup') {
      //if (inputData.key == 'z' || inputData.key == 'Z')
      if (inputData.key == '1') {
        this.evtData.attackType = 'Strength';
        DATASTORE.ENTITIES[this.evtData.avatarID].raiseMixinEvent('strAttack', this.evtData);
        this.game.switchMode('play');
      } //else if (inputData.key == 'x' || inputData.key == 'X')
      else if (inputData.key == '2') {
        this.evtData.attackType = 'Intelligence';
        DATASTORE.ENTITIES[this.evtData.avatarID].raiseMixinEvent('intelAttack', this.evtData);
        this.game.switchMode('play');
      } //else if (inputData.key == 'c' || inputData.key == 'C')
      else if (inputData.key == '3') {
        this.evtData.attackType = 'Agility';
        DATASTORE.ENTITIES[this.evtData.avatarID].raiseMixinEvent('agilAttack', this.evtData);
        this.game.switchMode('play');
      } else {
        this.game.getDisplay('main').drawText(3, 0, "Invalid Input...");
      } }
     }
  }

export class LevelUpMode extends UIMode{

  enter(){
    this.avatar = DATASTORE.ENTITIES[DATASTORE.GAME.modes.play._GAMESTATE_.avatarId];
    this.intelExpReq = this.avatar.getRequiredUpgradePoints('intelligence');
    this.strExpReq = this.avatar.getRequiredUpgradePoints('strength');
    this.agilExpReq = this.avatar.getRequiredUpgradePoints('agility');
    this.exp = this.avatar.getExp();

  }

  render(){
    console.dir(DATASTORE.GAME.modes);
    this.display.drawText(2, 0, 'You have ' + this.exp + ` ${Color.EXP}Experience${Color.DEFAULT} points to spend`);
    this.display.drawText(0, 1, '-------------------------------------------');
    this.display.drawText(42, 0,'|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|');
    this.display.drawText(30, 2, 'STATS');
    this.display.drawText(7, 4, `${Color.STRENGTH}Strength${Color.DEFAULT}: ` + this.avatar.getStats().strength + ' (' + this.strExpReq + ` ${Color.EXP}Exp${Color.DEFAULT} to upgrade)`);
    this.display.drawText(7, 7, `${Color.INTELLIGENCE}Intelligence${Color.DEFAULT}: ` + this.avatar.getStats().intelligence + ' (' + this.intelExpReq + ` ${Color.EXP}Exp${Color.DEFAULT} to upgrade)`);
    this.display.drawText(7, 10, `${Color.AGILITY}Agility${Color.DEFAULT}: ` + this.avatar.getStats().agility + ' (' + this.agilExpReq + ` ${Color.EXP}Exp${Color.DEFAULT} to upgrade)`);
    this.renderAgiChar();
    if (this.strExpReq <= this.exp){
      this.display.drawText(1, 3, '%c{#7CFC00}Press 1 to upgrade:%c{}');

    }
    if (this.intelExpReq <= this.exp){
      this.display.drawText(1, 6, '%c{#7CFC00}Press 2 to upgrade:%c{}');
    }
    if (this.agilExpReq <= this.exp){
      this.display.drawText(1, 9, '%c{#7CFC00}Press 3 to upgrade:%c{}');
    }
  }

  handleInput(inputType,inputData) {
    if (inputType == 'keyup') {
      if (inputData.key == 'Escape'){
        this.game.switchMode('play');
      } else if (inputData.key == '1' && this.strExpReq <= this.exp){
        this.avatar.deltaStrength(1);
        this.avatar.deltaExp(-this.strExpReq);
      } else if (inputData.key == '2' && this.intelExpReq <= this.exp){
        this.avatar.deltaIntelligence(1);
        this.avatar.deltaExp(-this.intelExpReq);
      } else if (inputData.key == '3' && this.agilExpReq <= this.exp){
        this.avatar.deltaAgility(1);
        this.avatar.deltaExp(-this.agilExpReq);
      } else{
        return false;
      }
    }
    this.intelExpReq = this.avatar.getRequiredUpgradePoints('intelligence');
    this.strExpReq = this.avatar.getRequiredUpgradePoints('strength');
    this.agilExpReq = this.avatar.getRequiredUpgradePoints('agility');
    this.exp = this.avatar.getExp();
    let d = DATASTORE.GAME.getDisplay('avatar');
    DATASTORE.GAME.modes.play.renderAvatar(d);
    return true;
  }

  renderStrChar(){
    this.display.drawText(43, 0, '|');
    this.display.drawText(43, 1, '|                   {}');
    this.display.drawText(43, 2, '|   ,   A           {}');
    this.display.drawText(43, 3, '|  / \\, | ,        .--.');
    this.display.drawText(43, 4, '| |    =|= >      /.--.\\');
    this.display.drawText(43, 5, '|  \\ /\` | \`       |====|');
    this.display.drawText(43, 6, '|   `   |         |`::`|');
    this.display.drawText(43, 7, '|       |     .-;\`\\..../\`;_.-^-._');
    this.display.drawText(43, 8, '|      /\\\\/  /  |...::..|`   :   `|');
    this.display.drawText(43, 9, '|      |:\'\\ |   /\'\'\'::\'\'|   .:.   |');
    this.display.drawText(43, 10, '|       \\ /\\;-,/\\   ::  |..     ..|');
    this.display.drawText(43, 11, '|       |\\ <\` >  >._::_.| \':   :\' |');
    this.display.drawText(43, 12, '|       | `""`  /   ^^  |   \':\'   |');
    this.display.drawText(43, 13, '|       |       |       \\    :    /');
    this.display.drawText(43, 14, '|       |       |        \\   :   /');
    this.display.drawText(43, 15, '|       |       |___/\\___|\`-.:.-\`');
    this.display.drawText(43, 16, '|       |        \\_ || _/    `');
    this.display.drawText(43, 17, '|       |        <_ >< _>');
    this.display.drawText(43, 18, '|       |        |  ||  |');
    this.display.drawText(43, 19, '|       |        |  ||  |');
    this.display.drawText(43, 20, '|       |       _\\.:||:./_');
    this.display.drawText(43, 21, '|       |      /____/\\____\\');
    this.display.drawText(43, 22, '|');
    this.display.drawText(43, 23, '|');
  }
  //                   {}
  //   ,   A           {}
  //  / \, | ,        .--.
  // |    =|= >      /.--.\
  //  \ /` | `       |====|
  //   `   |         |`::`|
  //       |     .-;`\..../`;_.-^-._
  //      /\\/  /  |...::..|`   :   `|
  //      |:'\ |   /'''::''|   .:.   |
  //       \ /\;-,/\   ::  |..     ..|
  //       |\ <` >  >._::_.| ':   :' |
  //       | `""`  /   ^^  |   ':'   |
  //       |       |       \    :    /
  //       |       |        \   :   /
  //       |       |___/\___|`-.:.-`
  //       |        \_ || _/    `
  //       |        <_ >< _>
  //       |        |  ||  |
  //       |        |  ||  |
  //       |       _\.:||:./_
  //       |      /____/\____\
  renderIntChar(){
    this.display.drawText(43, 0, '|             .');
    this.display.drawText(43, 1, '|            /:\\            .  ( (. *.) .');
    this.display.drawText(43, 2, '|           /:.:\\         .  .  )  *');
    this.display.drawText(43, 3, '|          /:.:.:\\          .*   /.  .    *');
    this.display.drawText(43, 4, '|         |wwWWWww|             /   .');
    this.display.drawText(43, 5, '|         (((""")))            /');
    this.display.drawText(43, 6, '|         (((""")))           /');
    this.display.drawText(43, 7, '|         (. @ @ .)          /');
    this.display.drawText(43, 8, '|         (( (_) ))      __ /');
    this.display.drawText(43, 9, '|        .-)))o(((-.    |:.\\');
    this.display.drawText(43, 10, '|       /.:((()))):.:\\  /.:.\\');
    this.display.drawText(43, 11, '|      /.:.:)))((:.:.:\\/.:.:.|');
    this.display.drawText(43, 12, '|     /.:.:.((()).:.:./.:.\\.:|');
    this.display.drawText(43, 13, '|    /.:.:.:.))((:.:.:.:./  \\|');
    this.display.drawText(43, 14, '|   /.:.:.:Y:((().Y.:.:./');
    this.display.drawText(43, 15, '|  /.:.:.:/:.:)).:\\:.:.|');
    this.display.drawText(43, 16, '| /.:.:.:/|.:.(.:.:\\:./');
    this.display.drawText(43, 17, '|/.:.:.:/ |:.:.:.:.|\\\'');
    this.display.drawText(43, 18, '|\\\`;.:./  |.:.:.:.:|');
    this.display.drawText(43, 19, '| |./\'    |:.:.:.:.|');
    this.display.drawText(43, 20, '|        |:.:.:.:.:.|');
    this.display.drawText(43, 21, '|       |.:.:.:.:.:.:|');
    this.display.drawText(43, 22, '|       |:.:.:.:.:.:.|');
    this.display.drawText(43, 23, '|       \`-:.:.:.:.:.-\'');
  }
  //                      .
  //                     /:\           .  ( (. *.) .
  //                    /:.:\        .  .  )  *
  //                   /:.:.:\         .*   /.  .    *
  //                  |wwWWWww|            /   .
  //                  (((""")))           /
  //                  (. @ @ .)          /
  //                  (( (_) ))      __ /
  //                 .-)))o(((-.    |:.\
  //                /.:((()))):.:\  /.:.\
  //              /.:.:)))((:.:.:\/.:.:.|
  //             /.:.:.((()).:.:./.:.\.:|
  //            /.:.:.:.))((:.:.:.:./  \|
  //           /.:.:.:Y:((().Y.:.:./
  //          /.:.:.:/:.:)).:\:.:.|
  //         /.:.:.:/|.:.(.:.:\:./
  //        /.:.:.:/ |:.:.:.:.|\'
  //        `;.:./   |.:.:.:.:|
  //         |./'    |:.:.:.:.|
  //                |:.:.:.:.:.|
  //               |.:.:.:.:.:.:|
  //               |:.:.:.:.:.:.|
  //               `-:.:.:.:.:.-'
  renderAgiChar(){
    this.display.drawText(43, 0, '|              __.------.');
    this.display.drawText(43, 1, '|             (__  ___   )');
    this.display.drawText(43, 2, '|              .)e  )\\ /');
    this.display.drawText(43, 3, '|             /_.------');
    this.display.drawText(43, 4, '|             _/_    _/');
    this.display.drawText(43, 5, '|         __.\'  / \'   \`-.__');
    this.display.drawText(43, 6, '|        / <.--\'           \`\\');
    this.display.drawText(43, 7, '|       /   \\   \\c           |');
    this.display.drawText(43, 8, '|      /    /    )       x    \\');
    this.display.drawText(43, 9, '|     |   /\\    |c     / \\.-  \\');
    this.display.drawText(43, 10, '|     \\__/  )  /(     (   \\   <>\'\\');
    this.display.drawText(43, 11, '|          / _/ _\\-    \`-. \\/_|_ /<>');
    this.display.drawText(43, 12, '|         / /--/,-\\     _ \\     <>.\`');
    this.display.drawText(43, 13, '|         \\/\`--\\_._) - /   \`-/\\    \`.\\');
    this.display.drawText(43, 14, '|         /        \`.     /   )     \`\\');
    this.display.drawText(43, 15, '|         \\      \\   \\___/----\'');
    this.display.drawText(43, 16, '|         |      /    \`(');
    this.display.drawText(43, 17, '|         \\    ./\\_   _ \\');
    this.display.drawText(43, 18, '|         /     |  )    \'|');
    this.display.drawText(43, 19, '|        |     /   \\     \\');
    this.display.drawText(43, 20, '|       /     |     |____.)');
    this.display.drawText(43, 21, '|      /      \\  a88a\\___/88888a.');
    this.display.drawText(43, 22, '|      \\_      :)888888888888888888');
    this.display.drawText(43, 23, '|     /\` \`-----\'  \`Y88888888888888888');
  }

//                   __.------.
//                  (__  ___   )
//                   .)e  )\ /
//                  /_.------
//                  _/_    _/
//              __.'  / '   `-.__
//             / <.--'           `\
//            /   \   \c           |
//           /    /    )       x    \
//          |   /\    |c     / \.-  \
//          \__/  )  /(     (   \   <>'\
//               / _/ _\-    `-. \/_|_ /<>
//              / /--/,-\     _ \     <>.`.
//              \/`--\_._) - /   `-/\    `.\
//              /        `.     /   )     `\
//              \      \   \___/----'
//              |      /    `(
//              \    ./\_   _ \
//             /     |  )    '|
//            |     /   \     \
//           /     |     |____.)
//          /      \  a88a\___/88888a.
//          \_      :)8888888888888888888a.
//         /` `-----'  `Y88888888888888888
//         \____|         `88888888888P'
  renderPeasChar(){

  }








}
