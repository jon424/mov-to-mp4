import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { convertMovToMp4 } from './convert';

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.use(express.static('../frontend/dist'));

// Store conversion progress for each file
const conversionProgress = new Map<string, number>();

app.post('/upload', upload.single('file'), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  const fileId = req.file.filename;
  conversionProgress.set(fileId, 0);

  try {
    const outputPath = await convertMovToMp4(req.file.path);
    // Set the file ID in the response headers
    res.setHeader('X-File-Id', fileId);
    res.download(outputPath);
  } catch (err) {
    res.status(500).send('Conversion failed.');
  } finally {
    conversionProgress.delete(fileId);
  }
});

// Endpoint to check conversion progress
app.get('/progress/:fileId', (req, res) => {
  const progress = conversionProgress.get(req.params.fileId) || 0;
  res.json({ progress });
});

app.listen(3000, () => console.log('Server running on port 3000'));