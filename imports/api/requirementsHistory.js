import { Mongo } from 'meteor/mongo';

const RequirementsHistoryCollection = new Mongo.Collection('requirementsHistory');
RequirementsHistoryCollection.attachBehaviour('timestampable');

export {
  RequirementsHistoryCollection
};
