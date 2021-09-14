import { CompanyInfoCollection } from '/imports/api/companyInfo';

Meteor.publish({

  allCompanyInfo() {
    return CompanyInfoCollection.find();
  },

});
