import { CategoriesCollection } from '/imports/api/categories';

Meteor.publish({

  allCategories() {
    return CategoriesCollection.find();
  },

  categoryById(categoryId) {
    return CategoriesCollection.find({ _id: categoryId });
  }

})