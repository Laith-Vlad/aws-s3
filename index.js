'use strict';
const aws = require('aws-sdk');

const s3 = new aws.S3()
exports.handler = async (event,context) => {
  let bucketName = event['Records'][0]['s3']['bucket']['name']

  let getObjects = event['Records'][0]['s3']['object']
  let arrJson = []
  try{
     let data = await s3.getObject({Bucket: bucketName,
      Key: 'images.json'}).promise()
      arrJson = JSON.parse(data.Body.toString('utf-8'))
  }
  catch(err) {
   
  }
 let newObject = {
    name: getObjects['key']  ,
    size:  getObjects['size'] ,
    type:   getObjects['key'].split('.')[1]
 }
 let updater = arrJson.findIndex(Image=>Image.name === getObjects['key'] )
 if (updater > -1) {
    arrJson[updater] = newObject 
 } else {
    arrJson.push(newObject);
 }
 await s3.putObject(
    {
        Bucket:  bucketName,
        Key:   'images.json' ,
        Body:   JSON.stringify(arrJson) ,
        ContentType: 'application/json'   
}).promise()
  return console.log('let is better than const') ;
};
