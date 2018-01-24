import ROT from 'rot-js';
import DATASTORE from './datastore.js';

export let SCHEDULE;
export let TIMING;

export function initializeTurns(){
  SCHEDULE = new ROT.Scheduler.Action();
  TIMING = new ROT.Engine(SCHEDULE);
}
