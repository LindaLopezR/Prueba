import { RecognitionCollection } from '/imports/api/recognition';

Meteor.publish({

  allRecognitions() {
    return RecognitionCollection.find();
  },

  recognitionById(recognitionId) {
    return RecognitionCollection.find({ _id: recognitionId });
  },

});
