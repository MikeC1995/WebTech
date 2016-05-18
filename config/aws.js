var AWS = require('aws-sdk');

module.exports = (function() {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY //TODO change to mike-admin?
  });
  var s3 = new AWS.S3();

  return {
    s3: s3,
    imagesBucket: 'tripmappr-images',
    thumbnailsBucket: 'tripmappr-images-resized'
  };
}());
