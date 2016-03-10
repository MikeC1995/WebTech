var AWS = require('aws-sdk');

module.exports = (function() {
  AWS.config.update({
    accessKeyId: 'AKIAIUU2YST2U4QMKJUA',
    secretAccessKey: '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'
  });
  var s3 = new AWS.S3();

  return {
    s3: s3,
    s3bucket: 'tripmappr-images'
  };
}());
