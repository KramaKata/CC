const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Endpoint untuk menerima foto dari pengguna
app.post('/translate', upload.single('image'), (req, res) => {
  // Menggunakan child process untuk menjalankan script Python yang mengolah foto
  const pythonProcess = spawn('python', ['translate_script.py', req.file.path]);

  // Mendapatkan output dari script Python
  pythonProcess.stdout.on('data', (data) => {
    const translation = data.toString().trim(); // Hasil terjemahan dari script Python

    // Mengirim hasil terjemahan sebagai respons API
    res.json({ translation });
  });

  // Menangani jika ada kesalahan dalam script Python
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
    res.status(500).json({ error: 'Terjadi kesalahan dalam memproses permintaan' });
  });
});

// Menjalankan server API pada port tertentu
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server API berjalan pada port ${PORT}`);
});
