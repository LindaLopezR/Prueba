import { Mongo } from 'meteor/mongo';

const RecognitionCollection = new Mongo.Collection('recognition');
RecognitionCollection.attachBehaviour('timestampable');

export {
  RecognitionCollection
};
