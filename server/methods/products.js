import { ProductsCollection } from '/imports/api/products';
import { InventoriesCollection } from '/imports/api/inventories';
import { RecognitionCollection } from '/imports/api/recognition';
import { Communication } from '../ddp-communications';

Meteor.methods({

  newProduct(json) {
    json.enable = true;

    let query = {
      name: json.name,
    };

    if (ProductsCollection.findOne(query)) {
      throw new Meteor.Error('duplicate-name', 'El nombre del producto ya existe.');
    }

    const dataProduct = ProductsCollection.insert(json);

    const data = {
      product: dataProduct,
      pieces: json.pieces,
      movements: [],
      orders: [],
      notifyPieces: json.notificationInventory
    }

    InventoriesCollection.insert(data);

    return true;
  },

  deleteProduct(productId) {
    return ProductsCollection.update({ _id: productId }, {$set: { enable: false } });
  },

  searchProducts(filters) {
    let query = { enable: true };

    if (filters.id) {
      query._id = filters.id;
    }

    let results = ProductsCollection.find(query, {sort: { name: 1 }}).fetch();

    if (filters.name) {
      const lower = filters.name.toLocaleLowerCase();
      results = results.filter(item => item.name.toLowerCase().includes(lower));
    };

    return results;
  },

  updateInventaryOrder(inventoryId) {
    const inventory = InventoriesCollection.findOne({ _id: inventoryId });
    const updatePieces = parseInt(inventory.pieces)-1;

    if (inventory.notifyPieces === updatePieces) {
      Communication.notifyLimitProduct(inventory.product, inventory.notifyPieces);
    };

    InventoriesCollection.update({ _id: inventoryId }, {
      $push: { 
        movements: {
          date: Date.now(),
          status: 'EXCHANGE',
          type: 'DELETED',
          pieces: 1,
        }
      },
      $set: { pieces: updatePieces }
    });
    return true;
  },

  productDelivered(json) {

    const recognition = RecognitionCollection.findOne({ _id: json.recognition });
    const inventories = InventoriesCollection.find({product: { $in: recognition.products }}).fetch();

    let listInventary = [];
    // Validación de productos de inventario
    inventories.map(inventory => {
      console.log('inventory.pieces', inventory.pieces)
      if (parseInt(inventory.pieces) === 0) {
        listInventary.push(inventory.product);
      }
    });

    if (listInventary.length > 0) {
      throw new Meteor.Error('not_product', `No hay inventario para el producto solicitado: ${recognition.note}`);
    }

    inventories.map(inventory => Meteor.call('updateInventaryOrder', inventory._id));
    RecognitionCollection.update({ _id: json.recognition }, {$set: {
      status: 'DELIVERED',
      delivered: Date.now(),
    }});
    return true;
  }

});
