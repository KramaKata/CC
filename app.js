const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

const modelPath = 'models/model.json';
let model; // Variabel untuk menyimpan model yang telah dimuat

async function loadModel() {
  try {
    model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log('Model TensorFlow berhasil dimuat.');
  } catch (error) {
    console.error('Terjadi kesalahan saat memuat model TensorFlow:', error);
  }
}

const processPrediction = (prediction) => {
  // Daftar aksara
  const aksaraLetters = ["ba", "ca", "da", "dha", "ga", "ha", "ja", "ka", "la", "ma", "na", "nga", "nya", "pa", "ra", "sa", "ta", "tha", "wa", "ya",];

  // Mengambil indeks kelas dengan nilai prediksi tertinggi
  const maxIndex = prediction.indexOf(Math.max(...prediction));

  // Mengambil huruf bahasa isyarat berdasarkan indeks
  const predictedLetter = aksaraLetters[maxIndex] || 'Unknown';

  // Mengembalikan string huruf bahasa isyarat hasil prediksi
  return predictedLetter;
};

// Memuat model saat server dimulai
loadModel();

app.post('/translate', upload.single('image'), async (req, res) => {
  try {
    // Validasi input
    if (!req.file || !req.file.path) {
      res.status(400).json({ error: 'File gambar tidak ditemukan.' });
      return;
    }

    // Baca gambar yang diunggah dari req.file.path
    const imageBuffer = fs.readFileSync(req.file.path);

    // Lakukan prapemrosesan jika diperlukan
    

    // Lakukan prediksi menggunakan model TensorFlow
    const image = tf.node.decodeImage(imageBuffer);
    const resizedImage = image.resizeBilinear([112, 112]);
    const grayscaleImage = resizedImage.mean(2).expandDims(2);
    const expandedImage = grayscaleImage.expandDims(); // Menambahkan dimensi batch
    const prediction = await model.predict(expandedImage);
    const result = await prediction.data();
    const predictedLetter = processPrediction(result);

    // Ambil kelas dengan probabilitas tertinggi
    

    // Hapus file gambar yang diunggah setelah selesai
    fs.unlinkSync(req.file.path);

    // Kirim respon berupa aksara Bahasa Jawa
    res.json({ aksara: predictedLetter });
  } catch (error) {
    console.error('Terjadi kesalahan dalam memproses gambar:', error);
    res.status(500).json({ error: 'Terjadi kesalahan dalam memproses gambar.' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
