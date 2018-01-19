import {Factory} from './factory.js';
import {Entity} from './entity.js';

export let EntityFactory = new Factory('ENTITIES', Entity);
console.log("Learning Entites");
EntityFactory.learn({
  name: 'avatar',
  descr: '',
  chr: '@',
  fg: '#eb4',
  mixinNames: ['TimeTracker', 'WalkerCorporeal', 'PlayerMessage', 'Hitpoints']
});
