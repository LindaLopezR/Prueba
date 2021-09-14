import { Mongo } from 'meteor/mongo';

const PointsCollection = new Mongo.Collection('points');
PointsCollection.attachBehaviour('timestampable');

export {
  PointsCollection
};
