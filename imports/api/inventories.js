import { Mongo } from 'meteor/mongo';

const InventoriesCollection = new Mongo.Collection('inventories');
InventoriesCollection.attachBehaviour('timestampable');

export {
  InventoriesCollection
};
