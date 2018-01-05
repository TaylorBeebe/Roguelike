import ROT from 'rot-js';
import * as U from './util.js';
import {StartupMode, PlayMode, LoseMode, WinMode} from './ui_mode.js';

export let Game = {

  DISPLAY_SPACING: 1.1,

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
    win: ''
  },
  curMode: '',

  init: function() {
    this._randomSeed = 5 + Math.floor(Math.random()*100000);
    //this._randomSeed = 76250;
    console.log("using random seed "+this._randomSeed);
    ROT.RNG.setSeed(this._randomSeed);

    this.display.main.o = new ROT.Display({
      width: this.display.main.w,
      height: this.display.main.h,
      spacing: this.display.SPACING});

      this.setupModes(this);
      this.switchMode("startup");
      console.log("game:");
      console.dir(this);
  },

  setupModes: function(){
    this.modes.startup = new StartupMode(this);
    this.modes.play = new PlayMode(this);
    console.log("startup mode");
  },

  _setupDisplays: function() {
    for (var display_key in this._display) {
      this._display[display_key].o = new ROT.Display({
        width: this._display[display_key].w,
        height: this._display[display_key].h,
        spacing: this._DISPLAY_SPACING});
    }
  },

  switchMode: function(newModeName){
    if (this.curMode){
      this.curMode.exit();
    }
    this.curMode = this.modes[newModeName];
    if (this.curMode){
      this.curMode.enter();
    }
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  render: function() {
    this.renderMain();
  },

  renderMain: function() {
      this.curMode.render(this.display.main.o);
      //this.renderDisplayAvatar();
      //this.renderDisplayMain();
      //this.renderDisplayMessage();
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
  }

};
