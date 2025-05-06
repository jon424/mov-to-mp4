import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { convertMovToMp4 } from './convert';

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.use(express.static('../frontend/dist'));

app.post('/upload', upload.single('file'), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  try {
    const outputPath = await convertMovToMp4(req.file.path);
    res.download(outputPath);
  } catch (err) {
    res.status(500).send('Conversion failed.');
  }
});



app.listen(3000, () => console.log('Server running on port 3000'));