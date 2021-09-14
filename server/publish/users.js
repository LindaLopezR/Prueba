Meteor.publish({

  allUsers() {
    return Meteor.users.find();
  },

  allActiveUsers() {
    return Meteor.users.find({ 'profile.enable': true });
  },

  allEmployees() {
    const roles = Meteor.roleAssignment.find({ 'role._id': 'user' }).fetch();
    const idsUsers = roles.map(item => item.user._id);

    let query = {
      _id: { $in: idsUsers },
      'profile.enable': true,
    };
    return Meteor.users.find(query);
  },
});
