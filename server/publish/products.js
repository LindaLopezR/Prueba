import { ProductsCollection } from '/imports/api/products';

Meteor.publish({

  allProducts() {
    return ProductsCollection.find();
  },

  allActiveProducts() {
    return ProductsCollection.find({ enable: true });
  },

});
