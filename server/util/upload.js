const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESSKEYID, 
    secretAccessKey: process.env.SECRETACCESSKEY, 
    region: process.env.REGION});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read-write',
        key: (req, file, cb) => {
          if (file.fieldname==='questionIMG') {
            cb(null, `${req.body.examID}/questions/${Date.now()}_${file.originalname}`);
          } else {
            cb(null, `${req.body.examID}/solutions/${Date.now()}_${file.originalname}`);
          }          
        }
    })
});

exports.upload = upload;
exports.s3 = s3;