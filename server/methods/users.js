Meteor.methods({

  searchEmployee(filters) {
    const roles = Meteor.roleAssignment.find({ 'role._id': 'user' }).fetch();
    const idsUsers = roles.map(item => item.user._id);

    let query = {
      _id: { $in: idsUsers },
      'profile.enable': true,
    };

    let results = Meteor.users.find(query, {sort: { 'profile.name': 1 }}).fetch();

    if (filters.employee) {
      const lower = filters.employee.toLocaleLowerCase();
      results = results.filter(item => item.username.toLowerCase().includes(lower));
    }

    if (filters.userName) {
      const lower = filters.userName.toLocaleLowerCase();
      results = results.filter(item => item.profile.name.toLowerCase().includes(lower));
    }

    return results;
  },

  newUser(json) {

    const nameUser = json.lastName 
      ? `${json.name.trim()} ${json.lastName.trim()}`
      : json.name;

    const lastUser = json.lastName 
      ? json.lastName.trim()
      : '';

    if (!json.numberEmployee) {
      throw new Meteor.Error('Employee-Number', 'Un usuario no puede quedarse sin número de empleado');
    }

    let profile = {
      name : nameUser,
      lastName : lastUser,
      image : json.img,
      enable: true,
      numberEmployee: json.numberEmployee,
    };

    let user = {
      username : json.username.trim(),
      password: json.numberEmployee.toString(),
      profile : profile,
    };

    const newUserCreate = Accounts.createUser(user);
    Roles.addUsersToRoles(newUserCreate, [ 'user' ]);
    return true;
  },

  editUser(json) {
    let oldUser = Meteor.users.findOne({ username: json.username });

    if (!json.img) {
      json.img = oldUser.profile.image;
    }

    let prof = Object.assign({}, oldUser.profile);
    prof.name = nameUser;
    prof.lastName = "";
    prof.image = json.img;
    prof.enable = true;

    return Meteor.users.update({ _id: oldUser._id }, {$set:{ profile: prof }});
  },

  confirmUserPassword(data) {
    const user = Meteor.users.findOne({ _id: data.userId });

    if (!user) {
      throw new Meteor.Error('invalid-token', 'Token o link inválido');
    }

    Accounts.setPassword(data.userId, data.password);
    return true;
	},

  setNewPassword(data) {
    Accounts.setPassword(data.userId, data.newPassword);
		return true;
  },

  deleteEmployees(userId) {
    console.log(userId)
    Meteor.users.update( { _id: userId }, { $set: { 'profile.enable': false} } );
    return true;
  },

  previewEmployees(rows) {
    if (!rows || rows.length == 0) {
      throw new Meteor.Error('invalid-file', 'Formato inválido');
    }

    const neededColumns = [
      'Oracle ID',
      'Full Name',
    ];

    const rowToTest = rows[0];
    const keys = Object.keys(rowToTest);

    // Validar que tenga todas las keys minimas
    let validFile = true;
    neededColumns.forEach(neededColumn => {
      if (!keys.includes(neededColumn)) {
        validFile = false;
        console.log('No tiene => ', neededColumn);
      }
    });

    if (!validFile) {
      throw new Meteor.Error('invalid-file', 'Archivo no válido, columnas no válidas.');
    }

    const data = rows.map(row => {
      row.alreadyExist = Meteor.users.find({
        username: row['Oracle ID'].toString(),
      }).count() > 0;
      return row;
    });

    const roles = Meteor.roleAssignment.find({ 'role._id': 'user' }).fetch();
    const idUser = roles.map(item => item.user._id);
    let query = {
      _id: { $in: idUser },
      'profile.enable': true,
    };
    const allUsers = Meteor.users.find(query).fetch();
    let idsUsers = allUsers.map(user => user.username);

    let usersNotFind = [];
    let dataUsersNotFind = [];
  
    const idsUsersData = data.map(i => i['Oracle ID'].toString())
    idsUsers.map(i => !idsUsersData.includes(i) && usersNotFind.push(i));

    usersNotFind.map(i => allUsers.find(user => user.username == i && dataUsersNotFind.push(user._id)));

    return {
      data: data.filter(user => !user.alreadyExist),
      dataUpdate: data.filter(user => user.alreadyExist),
      dataEliminate: dataUsersNotFind,
      countToEliminate: usersNotFind.length,
      countTotal: data.length,
      countToImport: data.filter(user => !user.alreadyExist).length,
      countAlreadyExists: data.filter(user => user.alreadyExist).length,
    };
  }

});
