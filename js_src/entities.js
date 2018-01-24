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
  expGainedForKill: 20,
  mixinNames: ['Hitpoints', 'Stats', 'StrengthAttack', 'PassiveAIActor']
});
