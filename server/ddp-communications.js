import { DDP } from 'meteor/ddp-client';

import { CompanyInfoCollection } from '/imports/api/companyInfo';
import { ProductsCollection } from '/imports/api/products';
import { QualityCollection } from '/imports/api/quality';
import { RecognitionCollection } from '/imports/api/recognition';

const URL_COMMUNICATION = process.env.NOTIFICATIONS_SERVER || 'http://notifications.goandsee.co';
const HOSTNAME = process.env.HOSTNAME || 'http://localhost:3000';

let instance = null;

class CommunicationServer {

  constructor() {

    if(!instance){
      instance = this;
    }

    this.ddpClient = DDP.connect(URL_COMMUNICATION);

    return instance;
  }

  notifyLimitProduct(productId, pieces) {
    const productData = ProductsCollection.findOne({ _id: productId });
    const company = CompanyInfoCollection.findOne();

    if (!company.emailRequirements && !company.userRequirements) {
      return;
    }

    this.ddpClient.call('sendNotifyLimitProduct', 
      productData.name,
      pieces,
      company.userRequirements,
      company.emailRequirements
    );
  }

  notifyRequiredProduct(product, pieces) {
    const productData = ProductsCollection.findOne({ _id: product });
    const company = CompanyInfoCollection.findOne();

    if (!company.emailRequirements && !company.userRequirements) {
      return;
    }

    this.ddpClient.call('sendNotifyRequiredProduct',
      productData.name,
      pieces,
      company.userRequirements,
      company.emailRequirements
    );
  }

  notifyNewRecognition(user, qualityData, userRecognition, recognitionId) {
    const owner = Meteor.users.findOne({ _id: user });
    const quality = QualityCollection.findOne({ _id: qualityData });
    const username = Meteor.users.findOne({ _id: userRecognition });
    const company = CompanyInfoCollection.findOne();

    if (!company.emailRecognitions && !company.userRecognitions) {
      return;
    }

    const url = `${HOSTNAME}/recognition/validate/${recognitionId}`;

    this.ddpClient.call('sendNotifyNewRecognition',
      owner.profile.name,
      quality.name,
      username.profile.name,
      company.userRecognitions,
      company.emailRecognitions,
      url
    );
  }

  notifyRecognitionApproved(recognitionId) {
    const recognition = RecognitionCollection.findOne(recognitionId);
    const sender = Meteor.users.findOne(recognition.sender);
    const receiver = Meteor.users.findOne(recognition.receiver);

    this.ddpClient.call('sendNotifyRecognitionApproved', sender, receiver, HOSTNAME);
  }

};

export const Communication = new CommunicationServer();
