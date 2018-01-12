import {factory} from './factory.js';
import {Entity} from './entities.js';

export let EntityFactory = new Factory(Entity,'ENTITIES');

EntityFactory.learn({
  'name': 'avatar',
  'chr': '@',
  'fg': '#eb4'
});
