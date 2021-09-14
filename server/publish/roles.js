// Roles de el usuario activo
Meteor.publish('rolesBySelfUser', function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  } else {
    this.ready()
  }
});

Meteor.publish({

  rolesByUser(userId) {
    return Meteor.roleAssignment.find({ 'user._id': userId });
  },

  allRoles() {
    return Meteor.roleAssignment.find();
  },

});
