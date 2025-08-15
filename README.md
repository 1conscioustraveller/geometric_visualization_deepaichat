# Geometric Visualization with Video Capture

A web-based interactive geometric visualization tool with adjustable settings and 7-second WEBM video capture functionality.

![Screenshot](screenshot.png) *(Note: You would add an actual screenshot file later)*

## Features

- **Interactive geometric visualizations**: Circle, Square, Triangle, and Spiral
- **Adjustable parameters**:
  - Shape type
  - Color picker
  - Size control
  - Rotation speed
  - Manual rotation
- **Video capture**: Record 7-second WEBM videos of the visualization
- **Download functionality**: Save your creations as video files
- **Responsive design**: Works on various screen sizes

## Technologies Used

- HTML5 Canvas for rendering
- JavaScript for animation and interactivity
- CCapture.js for video capture
- Pure CSS for styling

## Installation

No installation required! Just open the HTML file in a modern browser.

1. Download or clone this repository
2. Open `index.html` in your browser

*Note:* For video capture to work properly, it's recommended to:
- Use Chrome or Firefox
- Serve the files through a local web server (due to browser security restrictions)

### Quick Local Server Setup

If you have Python installed:

```bash
python -m http.server 8000
