import { InventoriesCollection } from '/imports/api/inventories';

Meteor.publish({

  allInventories() {
    return InventoriesCollection.find();
  },

  getInventoryById(inventoryId) {
    return InventoriesCollection.find({ _id: inventoryId });
  },

});
