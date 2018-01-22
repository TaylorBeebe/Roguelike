import {Messenger} from './messenger.js';
import {DATASTORE} from './datastore.js';

let _exampleMixin = {
  META:{
    mixinName: 'ExampleMixin',
    mixinGroupName: 'ExampleMixinGroup',
    stateNamespace: '_ExampleMixin',
    stateModel: {
      foo: 10
    },
    initialize: function() {
      // do any initialization

    }
  },
  METHODS:{
    method1: function(p){

    }
  }
};

export let TimeTracker = {
  META:{
    mixinName: 'TimeTracker',
    mixinGroupName: 'Tracker',
    stateNamespace: '_TimeTracker',
    stateModel: {
      timeTaken: 0
    }
  },

  METHODS:{
    addTime: function(t){
      this.attr._TimeTracker.timeTaken += t;
    },
    setTime: function(t){
      this.attr._TimeTracker.timeTaken = t;
    },
    getTime: function(){
      return this.attr._TimeTracker.timeTaken;
    }
  },
  LISTENERS: {
    'turnTaken' :function(evtData){
      // console.log('in turnTaken LISTENER');
      // console.log(evtData);
      this.addTime(evtData.timeUsed);
    }
  }
};

export let WalkerCorporeal = {
  META:{
    mixinName: 'WalkerCorporeal',
    mixinGroupName: 'Walker',
  },
  METHODS:{

    //tryWalk from class
    tryWalk: function (dx, dy){
      // console.log('now in the entity_mixins.tryWalk() function');
      let newX = this.attr.x*1 + dx*1;
      let newY = this.attr.y*1 + dy*1;

      if (!this.getMap().testLocationBlocked(newX, newY)){
        this.getMap().moveEntityTo(this, newX, newY);
        this.raiseMixinEvent('turnTaken', {timeUsed: 1});
        // console.log(this.getTime());
        return true;
      } else {
      this.raiseMixinEvent('walkBlocked', {reason: "there's something in the way"});
      return false;
      } } }
};

export let PlayerMessage = {
  META:{
    mixinName: 'PlayerMessage',
    mixinGroupName: 'Messenger',
  },
  LISTENERS:{
    'walkBlocked': function(evtData){
      Messenger.send(`${this.getName()} cannot walk there because ${evtData.reason}`);
    },
    'damagedMessage': function(evtData){
      if(evtData.attackType != 'Strength'){
      Messenger.send(`${evtData.wasDamagedBy} damaged ${this.getName()} ${evtData.damageAmount} points with an ${evtData.attackType} attack`);
      } else{
      Messenger.send(`${evtData.wasDamagedBy} damaged ${this.getName()} ${evtData.damageAmount} points with a ${evtData.attackType} attack`);
      }
    },
    'healedMessage': function (evtData){
      Messenger.send(`${this.getName()} gained ${evtData.healAmount} HP`);
    },
    'killedMessage': function(evtData){
      Messenger.send(`${evtData.wasDamagedBy} killed ${this.getName()}!`)
    },
    'expChangedMessage': function(evtData){
      if(evtData.deltaExp > 0){
        Messenger.send(`${this.getName()} gained ${evtData.deltaExp} experience.`);
      } else if (evtData.deltaExp < 0){
        Messenger.send(`${this.getName()} lost ${evtData.deltaExp} experience.`);
      }
    },
    'gainedStatsPointMessage': function(evtData){
      Messenger.send(`${this.getName()} gained 1 ${evtData.deltaStat} point!`);
    },
    'attackedMessage': function(evtData){
      Messenger.send(`${evtData.attacker} attacked ${evtData.victim}`);
    }
  }
}

export let Stats = {
  META:{
    mixinName: 'Stats',
    mixinGroupName: 'Stats',
    stateNamespace: '_Stats',
    stateModel: {
      agility: 0,
      strength: 0,
      intelligence: 0,
      experience: 0
    },
    initialize: function(template) {
      this.attr._Stats.agility = template.agility || 10;
      this.attr._Stats.strength = template.strength || 10;
      this.attr._Stats.intelligence = template.intelligence || 10;
      this.attr._Stats.experience = template.experience || 0;
    }
  },

  METHODS:{
    deltaIntelligence: function(deltaInt){
      this.attr._Stats.intelligence += deltaInt;
    },

    deltaStrength: function(deltaStr){
        this.attr._Stats.strength += deltaStr;
    },

    deltaAgility: function(deltaAgi){
      this.attr._Stats.agility += deltaAgi;
    },
    getStats: function(){
      // console.log('fetching stats');
      // console.dir(this.attr._Stats);
      return {agility: this.attr._Stats.agility, strength: this.attr._Stats.strength,
         intelligence: this.attr._Stats.intelligence};
    },
    getExp: function(){
      return this.attr._Stats.experience;
    }
  },
  LISTENERS:{
    //evtData contain -> deltaExp (exp change amount)
    'deltaExp': function(evtData){
      this.deltaExp(evtData.deltaExp);
      this.raiseMixinEvent('expChangedMessage', evtData);
    },
    //evtData contain -> deltaStat (stat changed)
    'deltaStats': function(evtData){
      if(evtData.deltaStat == 'Strength'){
        this.deltaStrength(1);
      } else if(evtData.deltaStat == 'Agility'){
        this.deltaAgility(1);
      } else if(evtData.deltaStat == 'Intelligence'){
        this.deltaIntelligence(1);
      }
      raiseMixinEvent('gainedStatsPointMessage', evtData);
    }
  }
};

export let Hitpoints = {

    META:{
      mixinName: 'Hitpoints',
      mixinGroupName: 'Hitpoints ',
      stateNamespace: '_Hitpoints',
      stateModel: {
        maxHP: 0,
        curHP: 0
      },
      initialize: function(template) {
        // console.log('initializing Hitpoints on entity -> ' + template.name);
        // console.log(this.template);
        this.attr._Hitpoints.maxHP = template.maxHP || 10;
        this.attr._Hitpoints.curHP = template.curHP || this.attr._Hitpoints.maxHP;
      }
    },
    METHODS:{
      gainHP: function(hp){
        if(this.attr._Hitpoints.curHP > this.attr._Hitpoints.maxHP) {
          this.attr_Hitpoints.curHP += hp;
        } else{
          this.attr._Hitpoints.curHP = this.attr._Hitpoints.maxHP;
        }
        this.raiseMixinEvent('healedMessage', {'healAmount' : hp})
      },

      loseHP: function(hp) {
        this.attr._Hitpoints.curHP -= hp;
      },

      setMaxHP: function(newMax) {
        this.attr._Hitpionts.maxHP = newMax;
      },

      getCurHP: function(){
        return this.attr._Hitpoints.curHP;
      },

      getMaxHP: function(){
        return this.attr._Hitpoints.maxHP;
      }
  },

  LISTENERS:{
    'damaged': function(evtData){
      this.loseHP(evtData.damageAmount);
      this.raiseMixinEvent('damagedMessage', evtData);

      if (this.attr._Hitpoints.curHP <= 0){
        this.raiseMixinEvent('killedMessage', evtData);
      }
    },
    'killed': function(evtData){
      this.raiseMixinEvent('killedMessage', evtData)
      this.destroy();
    }
  }
};

export let StrengthAttack = {
  META:{
    mixinName: 'StrengthAttack',
    mixinGroupName: 'Combat',
    stateNamespace: '_StrengthAttack',
    stateModel: {
      strengthAttackDamage: 1
    },
    initialize: function(template) {
      this.attr._StrengthAttack.strengthAttackDamage = template.strengthAttackDamage || 1;
    }
  },
  METHODS:{
    setstrengthAttackDamage: function(att){
      this.attr._StrengthAttack.strengthAttackDamage = att;
    },
    getStrengthAttackDamage: function(){
      return this.attr._StrengthAttack.strengthAttackDamage;
    }
  },
  LISTENERS:{
    //evtData contains -> wasDamagedBy(attacker), attackType(Strenth), victim(victim of attack), damageAmount(amount of damage dealt)
    'strAttack': function(evtData){
      this.raiseMixinEvent('attacked', {attacker: this.getName(), victim: evtData.victim});
      evtData.victim.raiseMixinEvent('damaged', evtData);
    }
  }
};

export let IntelligenceAttack = {
  META:{
    mixinName: 'IntelligenceAttack',
    mixinGroupName: 'Combat',
    stateNamespace: '_IntelligenceAttack',
    stateModel: {
      IntelligenceAttackDamage: 1
    },
    initialize: function(template) {
      this.attr._IntelligenceAttack.IntelligenceAttackDamage = template.IntelligenceAttackDamage || 1;
    }
  },
  METHODS:{
    setIntelligenceAttackDamage: function(att){
      this.attr._IntelligenceAttack.IntelligenceAttackDamage = att;
    },
    getIntelligenceAttackDamage: function(){
      return this.attr._IntelligenceAttack.IntelligenceAttackDamage;
    }
  },
  LISTENERS:{
    //evtData contains -> wasDamagedBy(attacker), attackType(Ingelligence), victim(victim of attack), damageAmount(amount of damage dealt)
    'intelAttack': function(evtData){
      this.raiseMixinEvent('attacked', {attacker: this.getName(), victim: evtData.victim});
      evtData.victim.raiseMixinEvent('damaged', evtData);
    }
  }
};

export let AgilityAttack = {
  META:{
    mixinName: 'AgilityAttack',
    mixinGroupName: 'Combat',
    stateNamespace: '_AgilityAttack',
    stateModel: {
      AgilityAttackDamage: 1
    },
    initialize: function(template) {
      this.attr._AgilityAttack.AgilityAttackDamage = template.AgilityAttackDamage || 1;
    }
  },
  METHODS:{
    setAgilityAttackDamage: function(att){
      this.attr._AgilityAttack.AgilityAttackDamage = att;
    },
    getAgilityAttackDamage: function(){
      return this.attr._AgilityAttack.AgilityAttackDamage;
    }
  },
  LISTENERS:{
    //evtData contains -> wasDamagedBy(attacker), attackType(Agility), victim(victim of attack), damageAmount(amount of damage dealt)
    'agilAttack': function(evtData){
      this.raiseMixinEvent('attacked', {attacker: this.getName(), victim: evtData.victim});
      evtData.victim.raiseMixinEvent('damaged', evtData);
    }
  }
};
