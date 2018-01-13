const aws        = require('aws-sdk');
const awsRouter  = require('express').Router();
const passport    = require('passport');

aws.config.region = process.env.S3_REGION;

awsRouter.get('/sign-s3', passport.authenticate('jwt', {session: false}), (req, res)=> {
  const s3 = new aws.S3(),
  fileType = req.query['file-type'],
  isValid = ["image/jpeg", "image/png", "image/gif"].includes(fileType);
  if(isValid){
    require('crypto').randomBytes(48, (error, buffer)=> {
      let token = buffer.toString('hex');
      const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${req.user.nickname}-${token}`,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
      }

      s3.getSignedUrl('putObject', s3Params, (error, data) => {
        if(error) return res.status(500).send(error);
        res.json({
          signedRequest: data,
          url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${req.user.nickname}-${token}`
        })
      })
    })
  }else res.status(403).end();
});

module.exports = awsRouter;
