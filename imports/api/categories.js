import { Mongo } from 'meteor/mongo';

const CategoriesCollection = new Mongo.Collection('categories');
CategoriesCollection.attachBehaviour('timestampable');

export {
  CategoriesCollection
};
