import {Color} from './colors.js';

export let Messenger = {
  messageQueue: [],
  maxLength: 50,
  fades: ['#fff','#ddd','#bbb','#999','#777','#555'],
  targetDisplay: '',

  init: function(d){
    this.targetDisplay = d;
  },

  render: function(){
    this.targetDisplay.clear();
    let y = 0;
    let index = 0;
    // console.log('now in messenger.render()');
    while (y < this.targetDisplay._options.height && index < this.targetDisplay._options.height && this.messageQueue[index]){
      if (this.messageQueue[index].age < this.fades.length){
        // console.log('fading message');
        let messageColor = '%c{'+this.fades[this.messageQueue[index].age]+'}';
        y += Math.max(1,this.targetDisplay.drawText(1,y,`${messageColor}${this.messageQueue[index].txt}${Color.DEFAULT}`));
      } index++; }
  },

  send: function(msg){
    // console.log('in messenger.send()');
    this.messageQueue.unshift({'txt':msg,'age':0});
    // console.log(this.messageQueue);
    while(this.messageQueue.length > this.maxLength){
      this.messageQueue.pop();
    }
    this.ageMessages();
    this.render();
  },

  clear: function(){
    this.messageQueue = [];
  },

  ageMessages: function(){
    console.log('aging messages');
    for (let i=0;i<10;i++) {
      if (this.messageQueue[i] && this.messageQueue[i].age < this.fades.length) {
        this.messageQueue[i].age++;
      } } }
};
