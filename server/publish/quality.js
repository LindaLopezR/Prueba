import { QualityCollection } from '/imports/api/quality';

Meteor.publish({

  allQuality() {
    return QualityCollection.find();
  },

  qualityById(qualityId) {
    return QualityCollection.find({ _id: qualityId });
  }

});
