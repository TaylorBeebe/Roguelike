//a general factory system - objects that create other objects
import {DATASTORE} from './datastore.js';

export class Factory{
  constructor(productClass, datastoreNamespace){
    this.productClass = productClass;
    this.datastoreNamespace = datastoreNamespace;
    this.knownTemplates = {};
  }

  learn(template){
    this.knownTemplates[template.templateName ? template.templateName :
    template.name] = template;
  }

  create(templateName){
    let product = new this.productClass(this.knownTemplates[templateName]);

    //DATASTORE.product.getID() = product;

    return product;
  }
}
