
import {DATASTORE} from './datastore.js';

export class Factory{
  constructor(datastoreNamespace, productClass){
    this.productClass = productClass;
    this.datastoreNamespace = datastoreNamespace;
    this.knownTemplates = {};
  }

  learn(template){
    this.knownTemplates[template.templateName ? template.templateName :
    template.name] = template;
  //   console.log("Known templates are: ");
  //   console.dir(this.knownTemplates);
  }

  create(templateName, restorationState){
    // console.log('now in the Factory.create() method');
    //console.log(this.templateName);
    let product = new this.productClass(templateName, this.knownTemplates[templateName]);
    if (restorationState){
      product.fromState(restorationState);
    }
    DATASTORE[this.datastoreNamespace][product.getID()] = product;
    return product;
  }
}
