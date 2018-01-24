import ROT from 'rot-js';
import DATASTORE from './datastore.js';

export let SCHEDULE;
export let TIMING;

export function initializeTurns(){
  SCHEDULE = new ROT.Scheduler.Action();
  TIMING = new ROT.Engine(SCHEDULE);
}

export function scheduleActors(data){
  if(data){
    DATASTORE.SCHEDULE = data;
  } else{
    for (i=0; i<DATASTORE.ENTITIES; i++){
      SCHEDULE.add(DATASTORE.ENTITIES[i], true);
    }

  }
}
