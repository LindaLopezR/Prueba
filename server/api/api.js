import bodyParser from 'body-parser';

Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

const PostPicker = Picker.filter(function (req) {
  return req.method === 'POST';
});

const GetPicker = Picker.filter(function (req) {
  return req.method === 'GET';
});

GetPicker.route('/api/v1/getUsers', function (params, req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    res.end(JSON.stringify(Meteor.call('endpointGetUsers')));
  } catch(err) {
    res.writeHead(500);
    res.end();
  }
});

GetPicker.route('/api/v1/getValues', function (params, req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    res.end(JSON.stringify(Meteor.call('endpointGetValues')));
  } catch(err) {
    res.writeHead(500);
    res.end();
  }
});

GetPicker.route('/api/v1/getProducts', function (params, req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    res.end(JSON.stringify(Meteor.call('endpointGetProduct')));
  } catch(err) {
    res.writeHead(500);
    res.end();
  }
});

GetPicker.route('/api/v1/getHistory/:userId', function (params, req, res) {
  let userId = params.userId;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    res.end(JSON.stringify(Meteor.call('endpointGetHistory', userId)));
  } catch(err) {
    res.writeHead(500);
    res.end();
  }
});

PostPicker.route('/api/v1/login', function(params, req, res) {
  const json = req.body;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(Meteor.call('endpointLogin', json)));
});

PostPicker.route('/api/v1/completePurchase', function(params, req, res) {
  const json = req.body;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(Meteor.call('orderUser', json)));
});

PostPicker.route('/api/v1/newRecognition', function(params, req, res) {
  const json = req.body;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(Meteor.call('newRecognition', json)));
});
