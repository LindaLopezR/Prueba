import { Mongo } from 'meteor/mongo';

const ProductsCollection = new Mongo.Collection('products');
ProductsCollection.attachBehaviour('timestampable');

export {
  ProductsCollection
};
