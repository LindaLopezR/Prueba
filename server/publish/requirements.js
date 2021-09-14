
import {  RequirementsHistoryCollection } from '/imports/api/requirementsHistory';

Meteor.publish({

  allRequirements() {
    return RequirementsHistoryCollection.find();
  },

});
