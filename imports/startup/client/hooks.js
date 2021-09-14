import { useTracker } from 'meteor/react-meteor-data';
import { CategoriesCollection } from '/imports/api/categories';
import { CompanyInfoCollection } from '/imports/api/companyInfo';
import { InventoriesCollection } from '/imports/api/inventories';
import { ProductsCollection } from '/imports/api/products';
import { QualityCollection } from '/imports/api/quality';
import { RecognitionCollection } from '/imports/api/recognition';
import {  RequirementsHistoryCollection } from '/imports/api/requirementsHistory';

export const useAccount = () => useTracker(() => {

  const roleSubscription = Meteor.subscribe('rolesBySelfUser');

  const user = Meteor.user();
  const userId = Meteor.userId();
  const isLoggingIn = Meteor.loggingIn();
  const role = Roles.getRolesForUser(userId);

  return {
    user,
    role,
    userId,
    isLoggingIn,
    isLoggedIn: !!userId,
    loading: !roleSubscription.ready(),
  };
}, []);


export const useAllCategories = () => useTracker(() => {

  const categoriesSubscription = Meteor.subscribe('allCategories');
  const loading = !categoriesSubscription.ready();

  return {
    allCategories: CategoriesCollection.find().fetch(),
    loading,
  };
}, []);

export const useCategoryById = (categoryId) => useTracker(() => {

  const categorySubscription = Meteor.subscribe('categoryById', categoryId);
  const loading = !categorySubscription;

  return {
    category: CategoriesCollection.findOne({ _id: categoryId }),
    loading,
  };

}, [categoryId]);

export const useInfoCompany = () => useTracker(() => {

  const companySubscription = Meteor.subscribe('allCompanyInfo');
  const loading = !companySubscription.ready();

  return {
    companyInfo: CompanyInfoCollection.findOne(),
    loading,
  }
}, []);

export const useAllQualities = () => useTracker(() => {

  const qualitiesSubscription = Meteor.subscribe('allQuality');
  const loading = !qualitiesSubscription.ready();

  return {
    allQualities: QualityCollection.find().fetch(),
    loading,
  };
}, []);

export const useQualityById = (qualityId) => useTracker(() => {

  const qualitySubscription = Meteor.subscribe('qualityById', qualityId);
  const loading = !qualitySubscription;

  return {
    quality: QualityCollection.findOne({ _id: qualityId }),
    loading,
  };

}, [qualityId]);

export const useRecognitionById = (recognitionId) => useTracker(() => {

  const recognitionSubscription = Meteor.subscribe('recognitionById', recognitionId);
  const qualitiesSubscription = Meteor.subscribe('allQuality');
  const usersSubscription = Meteor.subscribe('allUsers');

  const loading = !recognitionSubscription.ready() || !qualitiesSubscription.ready()
   || !usersSubscription.ready();

  return {
    recognition: RecognitionCollection.findOne({ _id: recognitionId }),
    allQualities: QualityCollection.find().fetch(),
    allUsers: Meteor.users.find({ 'profile.enable': true }).fetch(),
    loading,
  }
}, [recognitionId]);

export const useAllUsers = () => useTracker(() => {

  const usersSubscription = Meteor.subscribe('allUsers');
  const loading = !usersSubscription.ready();

  return {
    allUsers: Meteor.users.find().fetch(),
    loading,
  }
}, []);

export const useAllEmployees = () => useTracker(() => {

  const usersSubscription = Meteor.subscribe('allEmployees');
  const rolesSubscription = Meteor.subscribe('allRoles');
  const loading = !usersSubscription.ready() || !rolesSubscription.ready();

  const roles = Meteor.roleAssignment.find({ 'role._id': 'user' }).fetch();
  const idsUsers = roles.map(item => item.user._id);

  let query = {
    _id: { $in: idsUsers },
    'profile.enable': true,
  };

  return {
    allEmployees: Meteor.users.find(query).fetch(),
    loading,
  }
}, []);

export const useAllProducts = () => useTracker(() => {

  const productsSubscription = Meteor.subscribe('allProducts');
  const loading = !productsSubscription.ready();

  return {
    allProducts: ProductsCollection.find().fetch(),
    loading,
  }
}, []);

export const useAllActiveProducts = () => useTracker(() => {

  const productsSubscription = Meteor.subscribe('allActiveProducts');
  const loading = !productsSubscription.ready();

  return {
    allProducts: ProductsCollection.find().fetch(),
    loading,
  }
}, []);

export const useInventoryById = (inventoryId) => useTracker(() => {

  const inventorySubscription = Meteor.subscribe('getInventoryById', inventoryId);
  const requirementsSubscription = Meteor.subscribe('allRequirements');
  const loading = !inventorySubscription || !requirementsSubscription;

  const inventory = InventoriesCollection.findOne({ _id: inventoryId });
  let orders = [];

  if (inventory) {
    inventory.orders.map(i => orders.push(i.orderId));
  }

  return {
    inventory: inventory,
    orders: RequirementsHistoryCollection.find({_id: { $in: orders }}).fetch(),
    loading,
  };

}, [inventoryId]);
