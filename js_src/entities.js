import {Factory} from './factory.js';
import {Entity} from './entity.js';

export let EntityFactory = new Factory('ENTITIES', Entity);

console.log("Learning Avatar Entity");

EntityFactory.learn({
  name: 'avatar',
  descr: '',
  chr: '@',
  fg: '#eb4',
  'mixinNames': ['TimeTracker', 'tryWalk']
});
