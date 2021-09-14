import { Mongo } from 'meteor/mongo';

const QualityCollection = new Mongo.Collection('quality');
QualityCollection.attachBehaviour('timestampable');

export {
  QualityCollection
};
