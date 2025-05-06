import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export function convertMovToMp4(inputPath: string): Promise<string> {
  const outputPath = inputPath + '.mp4';
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}