import 'babel-polyfill';
import ROT from 'rot-js';
import {Game} from './game.js';

window.onload = function() {
  console.log("starting WSRL - window loaded");
  // Check if rot.js can work on this browser
  if (!ROT.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
    return;
  }

  Game.init();

  // Add the containers to our HTML page
  document.getElementById('Main').appendChild(Game.getDisplay('main').getContainer());
  //document.getElementById('')

  Game.render();

  Game.bindEvent('keypress');
  Game.bindEvent('keydown');
  Game.bindEvent('keyup');
};
