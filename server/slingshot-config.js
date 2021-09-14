import { Slingshot } from 'meteor/edgee:slingshot';

const BUCKET_NAME   = process.env.S3_BUCKET_NAME || 'rewards';
const BUCKET_REGION = process.env.S3_REGION || 'us-west-1';

const ACCESS_KEY = process.env.S3_ACCESS_KEY || '';
const SECRET_KEY = process.env.S3_SECRET_KEY || '';

const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 3;
const S3_SERVER = process.env.S3_SERVER || undefined;

const DIRECTIVE_IMAGES = 'imageUploads';

const MAIN_DIRECTIVE = {
  AWSAccessKeyId: ACCESS_KEY,
  AWSSecretAccessKey: SECRET_KEY,
  bucket: BUCKET_NAME,
  acl: "public-read",
  region: BUCKET_REGION,
  authorize() {
    return !!Meteor.user();
  },
  key(file) {
    let filename = file.name;
    console.log('Filaname 1 => ', filename);
    //Quitar acentos
    filename = filename.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    console.log('Filaname 2 => ', filename);
    //Quitar espacios
    filename = filename.replace(/ /g, '');
    console.log('Filaname 3 => ', filename);
    //Quitar caracteres especiales
    filename = filename.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
    console.log('Filaname 4 => ', filename);
    filename = `${Date.now()}${filename}`;

    const currentUserId = Meteor.user()._id;
    return `${currentUserId}/${filename}`;
  }
};

if (S3_SERVER) {
  MAIN_DIRECTIVE.bucketUrl = `${S3_SERVER}/${BUCKET_NAME}`;
}

Slingshot.fileRestrictions(DIRECTIVE_IMAGES, {
  allowedFileTypes: ["image/png", "image/jpeg", "application/pdf", "video/mp4", "audio/mpeg", "audio/mp3"],
  maxSize: MAX_FILE_SIZE * 1024 * 1024,
});

Slingshot.createDirective(DIRECTIVE_IMAGES, Slingshot.S3Storage, MAIN_DIRECTIVE);
