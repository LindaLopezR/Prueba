import { CategoriesCollection } from '/imports/api/categories';
import { ProductsCollection } from '/imports/api/products';

Meteor.methods({

  newCategory(json) {

    if (CategoriesCollection.findOne(json)) {
      throw new Meteor.Error('duplicate-name', 'El nombre de la categoría ya existe.');
    }

    return CategoriesCollection.insert(json);
  },

  editCategory(categoryId, json) {
    return CategoriesCollection.update({ _id: categoryId }, { $set: { name: json } });
  },

  deleteCategory(categoryId) {
    const listProducts = ProductsCollection.find({ category: categoryId }).fetch();

    if (listProducts.length > 0) {
      throw new Meteor.Error('category-in-use', 'Categoría en uso');
    }

    return CategoriesCollection.remove({ _id: categoryId });
  },

  searchCategories(filters) {
    let query = {};

    let results = CategoriesCollection.find(query, {sort: { name: 1 }}).fetch();

    if (filters.name) {
      const lower = filters.name.toLocaleLowerCase();
      results = results.filter(item => item.name.toLowerCase().includes(lower));
    };

    return results;
  },
  
});
