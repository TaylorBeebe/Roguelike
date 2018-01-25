import {Color} from './colors.js';

export let Char = {
  OGRE: `'${Color.OGRE}&${Color.DEFAULT}' is mighty ogre. This beast is agressive, slow, and will attack on sight.` +
  'Deals 20 damage per hit and every action he performs uses 200 energy.',
  WALL: `'#' is a wall. It is solid and impassable.`,
  FLOOR: `'.' is a floor. It can be walked on to reach a desired destination.`,
  AVATAR: `'${Color.AVATAR}@${Color.DEFAULT}' is you. You are the chosen one.`
}
