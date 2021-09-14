import { QualityCollection } from '/imports/api/quality';

Meteor.methods({

  newQuality(json) {
    json.enable = true;

    return QualityCollection.insert(json);
  },

  editQuality(qualityId, json) {

    return QualityCollection.update({ _id: qualityId }, { $set: json });
  },

  deleteQuality(qualityId) {
    return QualityCollection.update({ _id: qualityId }, {$set: { enable: false } });
  },

  searchQuality(filters) {
    let query = { enable: true };

    let results = QualityCollection.find(query, {sort: { name: 1 }}).fetch();

    if (filters.name) {
      const lower = filters.name.toLocaleLowerCase();
      results = results.filter(item => item.name.toLowerCase().includes(lower));
    };

    return results;
  },
  
});
