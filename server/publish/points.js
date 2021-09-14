import { PointsCollection } from '/imports/api/points';

Meteor.publish({

  pointsByUser(userId) {
    return PointsCollection.findOne({ user: userId });
  },

});
