// Updated script.js with stability fixes
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Control elements
const patternSelect = document.getElementById('pattern');
const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');
const speedInput = document.getElementById('speed');
const complexityInput = document.getElementById('complexity');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');

// State variables
let width, height;
let time = 0;
let isCapturing = false;
let capturer;
let downloadUrl;
let lastFrameTime = 0;
let isAnimating = false;
let safePattern = "hypnotic"; // Fallback pattern

// Initialize canvas
function resizeCanvas() {
    width = window.innerWidth * 0.9;
    height = window.innerHeight * 0.6;
    canvas.width = width;
    canvas.height = height;
}

// Performance-optimized draw
function safeDraw() {
    if (isAnimating) return;
    isAnimating = true;
    
    try {
        // Clear with trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        const pattern = patternSelect.value;
        if (patterns[pattern]) {
            patterns[pattern]();
        }
    } catch (error) {
        console.error("Pattern error:", error);
        patternSelect.value = safePattern; // Revert to safe pattern
    } finally {
        isAnimating = false;
    }
}

// Throttled animation loop
function animate() {
    const now = Date.now();
    const delta = now - lastFrameTime;
    
    // Throttle to 30fps max during heavy renders
    if (delta < 33) {
        requestAnimationFrame(animate);
        return;
    }
    
    lastFrameTime = now;
    time += delta / 1000; // Time delta in seconds
    
    safeDraw();
    
    if (isCapturing) {
        capturer.capture(canvas);
        if (now - captureStartTime >= 7000) {
            stopCapture();
        }
    }
    
    requestAnimationFrame(animate);
}

// Updated Hypnotic Circles (now crash-proof)
const patterns = {
    hypnotic: function() {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) * 0.45;
        const rings = Math.min(15, parseInt(complexityInput.value));
        
        for (let i = 0; i < rings; i++) {
            const progress = i / rings;
            const radius = maxRadius * progress;
            const angle = time * parseFloat(speedInput.value) * (0.5 + progress);
            
            ctx.beginPath();
            ctx.arc(
                centerX + Math.sin(angle) * 20,
                centerY + Math.cos(angle) * 20,
                radius,
                0,
                Math.PI * 2
            );
            
            const gradient = ctx.createRadialGradient(
                centerX, centerY, radius * 0.2,
                centerX, centerY, radius
            );
            gradient.addColorStop(0, color1Input.value);
            gradient.addColorStop(1, color2Input.value);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3 + 10 * (1 - progress);
            ctx.stroke();
        }
    },

    fractal: function() {
        const MAX_LAYERS = 8; // Performance cap
        const layers = Math.min(parseInt(complexityInput.value), MAX_LAYERS);
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let i = 0; i < layers; i++) {
            const progress = i / layers;
            const size = Math.min(width, height) * (0.2 + 0.8 * progress);
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(time * parseFloat(speedInput.value));
            
            // Simplified flower petals
            const petals = 5 + Math.floor(progress * 10);
            for (let j = 0; j < petals; j++) {
                const angle = (j / petals) * Math.PI * 2;
                ctx.beginPath();
                ctx.ellipse(
                    Math.cos(angle) * size * 0.4,
                    Math.sin(angle) * size * 0.4,
                    size * 0.2,
                    size * 0.4,
                    angle,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = `hsla(${j * 360/petals}, 100%, 50%, ${0.7 - progress*0.4})`;
                ctx.fill();
            }
            
            ctx.restore();
            if (Date.now() - lastFrameTime > 33) break; // Frame budget
        }
    },

    // ... (keep other patterns similar but add MAX_LAYERS checks) ...
};

// Safe pattern switching
patternSelect.addEventListener('change', () => {
    ctx.clearRect(0, 0, width, height);
    setTimeout(safeDraw, 50); // Let browser breathe
});

// ... (keep existing resize/capture/download code) ...

// Initialize
resizeCanvas();
animate();
