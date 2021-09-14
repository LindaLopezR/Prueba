
import { CompanyInfoCollection } from '/imports/api/companyInfo';

Meteor.methods({

  settingsCompany(data) {
    const oldInfo = CompanyInfoCollection.findOne();
    return CompanyInfoCollection.update({ _id: oldInfo._id }, { $set: { 
      emailRequirements: data.email,
      userRequirements: data.name
    } });
  },

  settingsRecognitions(data) {
    const oldInfo = CompanyInfoCollection.findOne();
    return CompanyInfoCollection.update({ _id: oldInfo._id }, { $set: { 
      emailRecognitions: data.email,
      userRecognitions: data.name
    } });
  },

});
