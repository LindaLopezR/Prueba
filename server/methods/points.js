import { PointsCollection } from '/imports/api/points';
import { RecognitionCollection } from '/imports/api/recognition';

Meteor.methods({

  pointsAllUsers() {
    return PointsCollection.find().fetch();
  },

  pointsByUser(userId) {
    const user = PointsCollection.findOne({ user: userId });
    return user ? user.points : 0;
  },

  pointsHistoryByUser(userId) {
    return RecognitionCollection.find(
      { $or: [ { owner: userId }, { username: userId } ] },
      { sort: { date: -1 } }
    ).fetch();
  },

});
