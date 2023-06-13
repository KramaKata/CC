const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const bcrypt = require('bcrypt');
const { performPrediction } = require('./TensorFlow');
const { Storage } = require('@google-cloud/storage');
const { spawnSync } = require('child_process');
const path = require('path');

const storage = new Storage();

const uploadFileToBucket = async (file, bucketName, destination) => {
  const bucket = storage.bucket(bucketName);

  const uploadOptions = {
    destination: destination,
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  };

  await bucket.upload(file.path, uploadOptions);
  const files = bucket.file(destination);
  
  // Unduh file dari Cloud Storage
  const [fileData] = await files.download();

  // FileData adalah buffer gambar
  return fileData;
};

const uploadFileHandler = async (request, h) => {
  try {
    const file = request.payload.img;
    const bucketName = 'kramakata';
    const destination = `upload/${file.filename}`;


    const fileUrl = await uploadFileToBucket(file, bucketName, destination);
    
    const model = await tf.loadLayersModel('models\model.json');

    const result = await performPrediction(model, fileUrl);
    return result;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return h.response('Internal server error').code(500);
  }
};

module.exports = {
  // uploadFileAndPredictHandler,
  uploadFileHandler
};
