const express = require('express');
const bodyParser = require('body-parser');
const { Translate } = require('@google-cloud/translate').v2;

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Inisialisasi Google Translate API
const translate = new Translate();

// Endpoint POST untuk mentranslate Bahasa Jawa ke Bahasa Indonesia
app.post('/translate', async (req, res) => {
  const { text } = req.body;

  try {
    // Panggil fungsi translate dari Google Translate API
    const [translation] = await translate.translate(text, 'id');

    res.json({ translation });
  } catch (error) {
    console.error('Error during translation:', error);
    res.status(500).json({ error: 'Failed to translate text.' });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
