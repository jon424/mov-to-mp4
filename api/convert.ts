import { VercelRequest, VercelResponse } from '@vercel/node';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';

// Configure formidable
const form = new IncomingForm({
  uploadDir: '/tmp',
  keepExtensions: true,
  maxFileSize: 100 * 1024 * 1024, // 100MB limit
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = file.filepath;
    const outputPath = path.join('/tmp', `${uuidv4()}.mp4`);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .on('progress', (progress) => {
          console.log('Conversion progress:', progress.percent);
        })
        .on('end', () => resolve())
        .on('error', reject)
        .run();
    });

    // Read the converted file
    const fileBuffer = await fs.readFile(outputPath);

    // Clean up temporary files
    await Promise.all([
      fs.unlink(inputPath),
      fs.unlink(outputPath)
    ]);

    // Set headers for file download
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.mp4');
    res.send(fileBuffer);
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
} 