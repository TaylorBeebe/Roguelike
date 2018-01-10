import ROT from 'rot-js';
import * as U from './util.js';
import {StartupMode, PlayMode, LoseMode, WinMode, PersistenceMode} from './ui_mode.js';
import {Messenger} from './messenger.js';
import {DATASTORE, initializeDatastore} from './datastore.js';

export let Game = {

  SPACING: 1.1,

  messageHandler : Messenger,

  display: {
    main: {
      w: 80,
      h: 24,
      o: null
    },
    avatar: {
      w: 20,
      h: 24,
      o: null
    },
    message: {
      w: 100,
      h: 6,
      o: null
    }
  },

  modes: {
    startup: '',
    play: '',
    lose: '',
    win: '',
    persistence : ''
  },
  curMode: '',

  _PERSISTANCE_NAMESPACE: 'ROGUELIKE GAME NAME',

  isPlaying: false,
  hasSaved: false,

  getDisplay: function(display){
    if (this.display.hasOwnProperty(display)) {
      return this.display[display].o;
    } else{
      return null;
    }
  },

  init: function() {

    this.setupDisplays();
    this.messageHandler.init(this.getDisplay('message'));

    this.setupModes(this);
    this.switchMode("startup");

    console.dir(this);
  },

  setupModes: function(){
    this.modes.startup = new StartupMode(this);
    this.modes.play = new PlayMode(this);
    this.modes.lose = new LoseMode(this);
    this.modes.win = new WinMode(this);
    this.modes.persistence = new PersistenceMode(this);
    console.log("Setup modes");
  },

  setupDisplays: function() {
    for (var display_key in this.display) {
      this.display[display_key].o = new ROT.Display({
        width: this.display[display_key].w,
        height: this.display[display_key].h,
        spacing: this.SPACING});
    }
    console.log("Displays set up");
  },

  switchMode: function(newModeName){
    if (this.curMode){
      this.curMode.exit();
    }
    this.curMode = this.modes[newModeName];
    if (this.curMode){
      this.curMode.enter();
    }
    this.render();
  },

  setupNewGame(){

    console.log("starting new game");
    initializeDatastore();
    DATASTORE.GAME = this;
    console.log("datastore:");
    console.dir(DATASTORE);
    this.modes.play.newGame();
    /*
    this._randomSeed = 5 + Math.floor(Math.random()*100000);
    //this._randomSeed = 76250;
    console.log("using random seed "+this._randomSeed);
    ROT.RNG.setSeed(this._randomSeed);
    */

  },

  render: function() {
    this.renderMain();
  },

  renderDisplayAvatar: function() {
    console.log("renderDisplayAvatar");
    let d = this.display.avatar.o;
    d.clear();
    d.drawText(2, 5, "AVATAR DISPLAY");
  },

  renderDisplayMain: function() {
    console.log("renderDisplayMain");
    this.display.main.o.clear();
    if (this.curMode === null || this.curMode == '') {
      return;
    } else {
      this.curMode.render();
    }
  },

  renderDisplayMessage: function() {
    console.log("renderDisplayMessage");
    this.messageHandler.render();
  },

  renderMain: function() {
    console.log("renderMain function");
    this.renderDisplayAvatar();
    this.renderDisplayMain();
    this.renderDisplayMessage();
  },

  bindEvent: function(eventType){
    window.addEventListener(eventType, (evt) => {
      this.eventHandler(eventType, evt);
    });
  },

  eventHandler: function (eventType, evt) {
    //Handle event recieved
    if (this.curMode !== null && this.curMode != ''){
      if (this.curMode.handleInput(eventType, evt)){
        this.render();
        //Message.ageMessages();
      }
    }
  },

  toJSON: function(){
    let json = '';
    json = JSON.stringify({rseed: this._randomSeed});
    return json;
  },

  fromJSON: function(json){
    let state = JSON.parse(json);
    this._randomSeed = state.rseed;
  }

};
