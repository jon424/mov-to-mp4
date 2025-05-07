# .mov to .mp4 Converter

## **Live Site:** [https://mov-to-mp4.vercel.app/](https://mov-to-mp4.vercel.app/)

A modern web application that converts .mov video files to .mp4 format with a beautiful, responsive user interface. The app features real-time progress tracking, dynamic time-based theming, and smooth animations.

## Features

- Convert .mov files to .mp4 format
- Real-time upload progress tracking
- Beautiful, responsive UI with dynamic time-based themes
- Smooth animations and transitions
- Instant file download after conversion
- Support for large file uploads

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [FFmpeg](https://ffmpeg.org/download.html) (required for video conversion)

### Installing FFmpeg

#### Windows
1. Download FFmpeg from the [official website](https://ffmpeg.org/download.html)
2. Extract the downloaded zip file
3. Add the `bin` folder to your system's PATH environment variable

#### macOS
```bash
brew install ffmpeg
```

#### Linux
```bash
sudo apt update
sudo apt install ffmpeg
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mov-to-mp4.git
cd mov-to-mp4
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Start the development servers:

In one terminal:
```bash
cd backend
npm run dev
```

In another terminal:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Usage

1. Open your web browser and navigate to http://localhost:5173
2. Click the file input area or drag and drop a .mov file
3. Click the "Convert" button
4. Wait for the conversion to complete
5. Click the download button to save your converted .mp4 file

## Technical Details

- Frontend: Vue.js 3 with TypeScript
- Backend: Node.js with Express
- Video Processing: FFmpeg
- Styling: CSS with modern features (CSS Grid, Flexbox, etc.)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
"# mov-to-mp4" 
