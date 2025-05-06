import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export function convertMovToMp4(inputPath: string): Promise<string> {
  const outputPath = inputPath + '.mp4';
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .on('progress', (progress) => {
        // Log progress to console for debugging
        console.log('Conversion progress:', progress.percent);
      })
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}