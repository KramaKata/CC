const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

// Fungsi untuk memuat model
async function loadModel() {
  const model = await tf.loadLayersModel('models\model.json');
  const weightData = fs.readFileSync('models\group1-shard1of2.bin');
  const weightArr = new Uint8Array(weightData.buffer);
  const weightTensor = tf.tensor(weightArr, [weightArr.length], 'float32');
  await model.weights[0].write(weightTensor);
  return model;
}

// Menggunakan model yang telah dimuat
async function useModel() {
  const model = await loadModel();
  // Lakukan sesuatu dengan model
  // ...
}

// Panggil fungsi useModel
useModel();
