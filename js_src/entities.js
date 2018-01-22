import {Factory} from './factory.js';
import {Entity} from './entity.js';

export let EntityFactory = new Factory('ENTITIES', Entity);
// console.log("Learning Entites");
EntityFactory.learn({
  name: 'avatar',
  descr: 'A mighty mage',
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
    // 'Collision'
  ]
});

EntityFactory.learn({
  templateName: 'ogre',
  descr: 'A mighty ogre',
  chr: '&',
  fg: '#c21515',
  maxHP: 20,
  mixins: ['WalkerCorporeal', 'Hitpoints', 'Stats', 'StrengthAttack']
});
