import { ProductsCollection } from '/imports/api/products';
import { QualityCollection } from '/imports/api/quality';
import { PointsCollection } from '/imports/api/points';
import { RecognitionCollection } from '/imports/api/recognition';

Meteor.methods({

  endpointLogin(json){
		console.log(json);
		let response = {};

		try {

			if (ApiPassword.validate({username: json.username, password: json.password})) {
				response.success = true;
      	response.message = 'Login success';

      	let user = Meteor.users.findOne({username:json.username});

      	if (!user) {
      		console.log('User doesnt exist');
      		response.success = false;
      		response.message = 'User doesnt exist';
					return response;
				}

				let points = PointsCollection.findOne({ user: user._id })
				points = points ? points.points : 0;
				user.profile.points = points;
				delete user.services;
				response.user = user;

      	if(!json.os || !json.pushToken){
      		console.log('Login without push');
      		return response;
      	}

      	//Eliminar ese pushToken de todos lados
				let query = {
					os: json.os,
					token : json.pushToken,
					product : json.product
				};

      	Meteor.users.update({'profile.pushTokens' : query}, { $pull:{
      			'profile.pushTokens': query
      		}
				});

				console.log('Push: ', query);
      	Meteor.users.update({ username:json.username }, { $push: {
      		'profile.pushTokens': query
      	}});

    	} else {
      	response.success = false;
      	response.message = 'Wrong data';
    	}
  	} catch (exc) {
  		console.log('Exception: ' + exc);
      response.success = false;
	    response.message = 'User doesnt exist';
  	}

  	return response;
	},

  endpointGetProduct() {
    return ProductsCollection.find().fetch();
  },

  endpointGetValues() {
    return QualityCollection.find().fetch();
  },

  endpointGetUsers() {
		const allPoints = PointsCollection.find().fetch();

    return Meteor.users.find({ username: {$ne: 'admin'} }).map(user => {
			const pointsEntry = allPoints.find(item => item.user == user._id);
			let points = pointsEntry? pointsEntry.points : 0;
			points = Number(points);
      delete user.services;
			user.profile.points = points;
      return user;
    });
  },

	endpointGetHistory(userId) {
		return RecognitionCollection.find(
      { $or: [ { owner: userId }, { username: userId } ] },
      { sort: { date: -1 } }
    ).fetch();
	},

});
