import { InventoriesCollection } from '/imports/api/inventories';
import { ProductsCollection } from '/imports/api/products';

Meteor.methods({

  searchInventory(filters) {
    const productsActives = ProductsCollection.find({ enable: true }).fetch();
    const idsProducts = productsActives.map(item => item._id);

    let query = {
      product: { $in: idsProducts },
    };

    let results = InventoriesCollection.find(query, {sort: { name: 1 }}).fetch();

    if (filters.product && filters.product != 'all') {
      results = results.filter(item => item.product == filters.product);
    }

    return results;
  },

  getInventoryById(inventoryId) {
    return InventoriesCollection.findOne({ _id: inventoryId });
  },

  editInventory(json) {
    const inventory = InventoriesCollection.findOne({ _id: json.inventoryId });
    const typeMovement = parseInt(inventory.pieces) > parseInt(json.pieces) ? 'DELETED' : 'ADD';
    InventoriesCollection.update({ _id: json.inventoryId }, {
      $set: { pieces: json.pieces },
      $push: { 
        movements: {
          date: Date.now(),
          status: 'UPDATE_PIECES',
          type: typeMovement,
          pieces: json.pieces
        }
      },
    });
    return true;
  }
});
