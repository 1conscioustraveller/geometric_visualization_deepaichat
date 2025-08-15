// ========== 1. INITIALIZATION ========== //
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const controls = { /* Your existing control references */ };
let width, height;
let time = 0;
let isCapturing = false;
let capturer;
let lastFrameTime = performance.now();

// Web Worker setup
let patternWorker;
if (window.Worker) {
  patternWorker = new Worker('pattern-worker.js');
} else {
  console.warn("Web Workers unavailable - using fallback mode");
}

// ========== 2. WEB WORKER COMMUNICATION ========== //
let activePattern = 'hypnotic';
let frameData = null;

if (patternWorker) {
  patternWorker.onmessage = (e) => {
    frameData = e.data;
    renderFrame();
  };
}

// ========== 3. CORE RENDERING LOGIC ========== //
function renderFrame() {
  if (!frameData) return;
  
  ctx.clearRect(0, 0, width, height);
  
  switch(activePattern) {
    case 'fractal':
      drawPaths(frameData.paths);
      break;
    case 'mandala':
      drawShapes(frameData.shapes);
      break;
    default:
      // Fallback to non-worker patterns
      drawBasicPattern();
  }
}

function drawPaths(paths) {
  paths.forEach(path => {
    ctx.beginPath();
    path.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
    ctx.stroke();
  });
}

// ========== 4. PATTERN SWITCHING ========== //
function switchPattern(newPattern) {
  if (patternWorker) {
    patternWorker.terminate();
    patternWorker = new Worker('pattern-worker.js');
    patternWorker.onmessage = (e) => {
      frameData = e.data;
      renderFrame();
    };
  }
  
  activePattern = newPattern;
  frameData = null; // Clear previous frame buffer
  
  if (shouldUseWorker(newPattern)) {
    requestPatternCalculation();
  } else {
    // Immediate render for simple patterns
    requestAnimationFrame(animate); 
  }
}

function shouldUseWorker(pattern) {
  return ['fractal', 'mandala'].includes(pattern) && patternWorker;
}

// ========== 5. ANIMATION LOOP ========== //
function animate(timestamp) {
  const frameDelay = timestamp - lastFrameTime;
  
  // Throttle to 30fps max during transitions
  if (frameDelay < 33 && !isCapturing) {
    requestAnimationFrame(animate);
    return;
  }
  
  if (shouldUseWorker(activePattern)) {
    requestPatternCalculation(timestamp);
  } else {
    drawBasicPattern();
  }
  
  lastFrameTime = timestamp;
  requestAnimationFrame(animate);
}

function requestPatternCalculation(timestamp = performance.now()) {
  patternWorker.postMessage({
    pattern: activePattern,
    time: timestamp / 1000,
    width,
    height,
    params: getCurrentParams() // Your existing control values
  });
}

// ========== 6. BASIC PATTERNS (Worker Fallback) ========== //
function drawBasicPattern() {
  // Your original non-worker patterns (hypnotic, wave)
  switch(activePattern) {
    case 'hypnotic':
      drawHypnoticCircles();
      break;
    case 'wave':
      drawColorWaves();
      break;
  }
}

// ========== 7. EVENT LISTENERS ========== //
patternSelect.addEventListener('change', () => {
  switchPattern(patternSelect.value);
});

// Your existing resize/capture handlers...
