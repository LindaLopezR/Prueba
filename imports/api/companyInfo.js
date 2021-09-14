import { Mongo } from 'meteor/mongo';

const CompanyInfoCollection = new Mongo.Collection('companyInfo');
CompanyInfoCollection.attachBehaviour('timestampable');

export {
  CompanyInfoCollection
};
