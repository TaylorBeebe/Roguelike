import {DisplaySymbol} from './display_symbol.js';
import * as E from './entity_mixins.js';
import {uniqueID} from './util.js';

export class MixableSymbol extends DisplaySymbol {

  constructor(template){
    super(template);
    this.name = template.name || template.templateName || 'no name';
    this.descr = template.descr || '';
    if(!this.attr){
      this.attr = {};
    }
    if(!template.mixins){
      template.mixins = [];
    }

    this.mixins = [];
    this.mixinTracker = {};
    //record/track any mixins this entity has
    if (template.mixinNames) {
      for (let mi = 0; mi < template.mixinNames.length; mi++){
        this.mixins.push(E[template.mixinNames[mi]]);
        this.mixinTracker[template.mixinNames[mi]] = true;
      }
    }
    // console.dir(this.mixins);
    //set up mixin state and import/insert mixin methods
    for (let mi = 0; mi < this.mixins.length; mi++){
      let m = this.mixins[mi];
      if(m.META.stateNamespace){
        this.attr[m.META.stateNamespace] = {};
        if(m.META.stateModel){
          for (let sbase in m.META.stateModel) {
            this.attr[m.META.stateNamespace][sbase] = m.META.stateModel[sbase];
          }
        }
      }
      //handle methods
      if(m.METHODS){
        for (let method in m.METHODS) {
          this[method] = m.METHODS[method];
        }
      }
    }
    //run any initializers
    for (let mi = 0; mi < this.mixins.length; mi++){
      let m = this.mixins[mi];
      if(m.META.hasOwnProperty('initialize')){
        m.META.initialize.call(this, template);
      }
    }
  }

  raiseMixinEvent(evtLabel, evtData){
    // console.log('raiseMixinEvent -> ' + evtLabel);
    for (let mi=0; mi<this.mixins.length; mi++){
      let m = this.mixins[mi];
      // console.log('m.LISTENERS -> ' + m.LISTENERS);
      // console.log('m.LISTENERS[evtLabel] -> ' + m.LISTENERS[evtLabel]);
      if (m.LISTENERS && m.LISTENERS[evtLabel]){
        m.LISTENERS[evtLabel].call(this, evtData);
      }
    }
  }

}
