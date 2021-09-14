import { InventoriesCollection } from '/imports/api/inventories';
import { RequirementsHistoryCollection } from '/imports/api/requirementsHistory';
import { Communication } from '../ddp-communications';

Meteor.methods({

  newRequirement(json) {
    const number = RequirementsHistoryCollection.find().fetch();

    const data = {
      orderNumber: number.length+1,
      product: json.product,
      pieces: json.number,
      status: 'PENDIENT',
      date: Date.now(),
    };
    const orderId = RequirementsHistoryCollection.insert(data);

    InventoriesCollection.update({ product: json.product }, {$push: { orders: {
      orderId
    }}});

    Communication.notifyRequiredProduct(json.product, json.number);

    return true;
  },

  cancelRequirement(requirementId) {
    RequirementsHistoryCollection.update({ _id: requirementId }, {$set: { status: 'CANCELLED', dateCancelled: Date.now() }});
    return true;
  },

  approvedRequirement(requirementId) {
    RequirementsHistoryCollection.update({ _id: requirementId }, {$set: { status: 'APPROVED', dateApproved: Date.now() }});
    return true;
  },

  updateRequirement(json) {
    // console.log('JSON => ', json.valueOrder._id, json.pieces)
    RequirementsHistoryCollection.update({ _id: json.valueOrder._id }, {$set: { status: 'COMPLETE', dateComplete: Date.now() }});
    // AGREGAR PRODUCTOS
    const inventory = InventoriesCollection.findOne({ 'orders.orderId': json.valueOrder._id });
    InventoriesCollection.update({ 'orders.orderId': json.valueOrder._id }, {
      $push: { 
        movements: {
          date: Date.now(),
          status: 'ORDER_ATTENDED',
          type: 'ADD',
          pieces: json.pieces,
        }
      },
      $set: { pieces: parseInt(inventory.pieces)+parseInt(json.pieces) }
    });
    return true;
  },

  searchRequirements(filters) {
    let query = {};

    if (filters.product && filters.product != 'all') {
      query.product = filters.product;
    }

    return RequirementsHistoryCollection.find(query, {sort: { date: -1 }}).fetch();
  },

});
