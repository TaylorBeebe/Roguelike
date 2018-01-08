export class Messager{

  constructor(){
    this.message = '';
  }

  render(targetDisplay){
    targetDisplay.clear();
    targetDisplay.drawText(1, 1, this.message);
  }

  send(msg){
    this.message = msg;
    this.render();
  }

  clear(){
    this.message = '';
  }
}

export let messager = new Messager();
