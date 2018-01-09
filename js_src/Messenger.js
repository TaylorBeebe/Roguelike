export let Messenger = {

  init: function(d){
    this.targetDisplay = d;
    this.message = '';
  },

  render: function(){
    this.targetDisplay.clear();
    this.targetDisplay.drawText(1, 1, this.message);
  },

  send: function(msg){
    this.message = msg;
    this.render();
  },

  clear: function(){
    this.message = '';
  }
}
