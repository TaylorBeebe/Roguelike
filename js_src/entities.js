import {Factory} from './factory.js';
import {Entity} from './entity.js';

export let EntityFactory = new Factory('ENTITIES', Entity);
console.log("Learning Entites");
EntityFactory.learn({
  name: 'avatar',
  descr: 'A mighty mage',
  chr: '@',
  fg: '#eb4',
  maxHP: 100,
  mixinNames: ['TimeTracker', 'WalkerCorporeal', 'PlayerMessage', 'Hitpoints']
});

EntityFactory.learn({
  templateName: 'ogre',
  descr: 'A mighty ogre',
  chr: '&',
  fg: '#7d6',
  maxHP: 10,
  mixins: ['WalkerCorporeal', 'Hitpoints']
});
