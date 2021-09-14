import { RecognitionCollection } from '/imports/api/recognition';
import { PointsCollection } from '/imports/api/points';
import { Communication } from '../ddp-communications';

Meteor.methods({

  newRecognition(json) {
    json.sender = json.username;
    json.receiver = json.owner;

    console.log('JSON => ', json);
    const number = RecognitionCollection.find({type: { $ne: 'exchange' }}).fetch();
    json.enable = true;
    json.number = number.length + 1;
    json.status = 'PENDIENT';
    json.type = 'assignment';
    json.date = Date.now();

    const recognitionId = RecognitionCollection.insert(json);
    console.log('Recognition ID => ', recognitionId);
    Communication.notifyNewRecognition(json.owner, json.quality, json.username, recognitionId);
    return recognitionId;
  },

  deleteRecognition(recognitionId) {
    return RecognitionCollection.update({ _id: recognitionId }, {$set: { enable: false } });
  },

  searchRecognition(filters) {
    let query = { enable: true, type: { $ne: 'exchange' } };

    if (filters.quality && filters.quality != 'all') {
      query.quality = filters.quality;
    }

    if (filters.behavior && filters.behavior != 'all' && filters.quality != 'all') {
      query.behavior = filters.behavior;
    }

    if (filters.owner && filters.owner != 'all') {
      query.owner = filters.owner;
    }

    let results = RecognitionCollection.find(query, {sort: { date: -1 }}).fetch();

    return results;
  },

  getMoventsRecognition(filters) {
    let query = {};

    if (filters.quality && filters.quality != 'all') {
      query.quality = filters.quality;
    }

    if (filters.behavior && filters.behavior != 'all') {
      query.behavior = filters.behavior;
    }

    if (filters.owner && filters.owner != 'all') {
      query.owner = filters.owner;
    }

    if (filters.status && filters.status != 'all') {
      query.status = filters.status;
    }

    if (filters.movement && filters.movement != 'all') {
      query.type = filters.movement;
    }

    let results = RecognitionCollection.find(query, {sort: { date: -1 }}).fetch();

    results = results.map(item => {
      const data = item;
      data.dateValid = new Date(item.date).setHours(0,0,0,0);
      return data;
    });
  
    if (filters.startDate) {
      results = results.filter(item => item.dateValid >= new Date(filters.startDate).setHours(0,0,0,0));
    }
  
    if (filters.finishDate) {
      results = results.filter(item => item.dateValid <= new Date(filters.finishDate).setHours(0,0,0,0));
    }
  
    return results;
  },

  generateReportRecognitions(filters) {
    let query = {};

    if (filters.quality && filters.quality != 'all') {
      query.quality = filters.quality;
    }

    if (filters.behavior && filters.behavior != 'all') {
      query.behavior = filters.behavior;
    }

    if (filters.owner && filters.owner != 'all') {
      query.owner = filters.owner;
    }
    
    if (filters.movement && filters.movement != 'all') {
      query.type = filters.movement;
    }

    let results = RecognitionCollection.find(query, {sort: { date: -1 }}).fetch();

    results = results.map(item => {
      const data = item;
      data.dateValid = new Date(item.date).setHours(0,0,0,0);
      return data;
    });

    if (filters.startDate) {
      results = results.filter(item => item.dateValid >= new Date(filters.startDate).setHours(0,0,0,0));
    }

    if (filters.finishDate) {
      results = results.filter(item => item.dateValid <= new Date(filters.finishDate).setHours(0,0,0,0));
    }

    return results;
  },

  // Aprueba el movimiento
  updatePointsUser(json) {

    RecognitionCollection.update({ _id: json.recognition }, {$set: { status: 'APPROVED', points: json.points }});
    const user = PointsCollection.findOne({ user: json.userId });
    user
      ? PointsCollection.update({ user: json.userId }, {$set: { points: parseInt(user.points)+parseInt(json.points) }})
      : PointsCollection.insert({ user: json.userId, points: parseInt(json.points) });

    Communication.notifyRecognitionApproved(json.recognition);
    return true;
  },

  cancelRecognition(json) {
    RecognitionCollection.update({ _id: json.recognition }, {$set: { status: 'CANCELLED', dateCancelled: Date.now() }});
    return true;
  },

  orderUser(data) {
    data.date = Date.now();
    data.type = 'exchange';
    data.status = 'PENDIENT';

    RecognitionCollection.insert(data);
    const user = PointsCollection.findOne({ user: data.owner });
    PointsCollection.update({ user: data.owner }, {$set: { points: parseInt(user.points)-parseInt(data.points) }})
    return true;
  },

});
