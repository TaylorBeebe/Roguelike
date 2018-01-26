import {Factory} from './factory.js';
import {Entity} from './entity.js';

export let EntityFactory = new Factory('ENTITIES', Entity);
// console.log("Learning Entites");
EntityFactory.learn({
  name: 'avatar',
  descr: 'the chosen one',
  chr: '@',
  fg: '#eb4',
  maxHP: 100,
  mixinNames: [
    'TimeTracker',
    'WalkerCorporeal',
    'PlayerMessage',
    'Hitpoints',
    'Stats',
    'StrengthAttack',
    'IntelligenceAttack',
    'AgilityAttack',
    'PlayerAttack',
    'PlayerActor',
    'PlayerEnergy'
  ]
});

EntityFactory.learn({
  name: 'ogre',
  descr: 'A mighty ogre',
  chr: '&',
  fg: '#c21515',
  maxHP: 5,
  strength: 10,
  intelligence: 0,
  agility: -49,
  expGainedForKill: 20,
  // isAgressive: true,
  mixinNames: [
    'Hitpoints',
    'Stats',
    'StrengthAttack',
    'AggressiveAIActor',
    'WalkerCorporeal',
    'AIWalk',
    'PlayerAttack']
});
