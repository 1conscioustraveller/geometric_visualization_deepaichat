const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const patternSelect = document.getElementById('pattern');
const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');
const speedInput = document.getElementById('speed');
const complexityInput = document.getElementById('complexity');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');

let width, height;
let time = 0;
let isCapturing = false;
let capturer;
let captureStartTime;
let downloadUrl;

// Initialize canvas
function resizeCanvas() {
    width = window.innerWidth * 0.9;
    height = window.innerHeight * 0.6;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', () => {
    resizeCanvas();
});

// Psychedelic patterns
const patterns = {
    hypnotic: function() {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) * 0.45;
        const rings = 15;
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        const speed = parseFloat(speedInput.value);
        const complexity = parseInt(complexityInput.value);

        for (let i = 0; i < rings; i++) {
            const progress = i / rings;
            const radius = maxRadius * progress;
            const angle = time * speed * (0.5 + progress);
            const pulse = 0.5 + 0.5 * Math.sin(time * speed * 2 + progress * complexity);
            
            ctx.beginPath();
            ctx.arc(
                centerX + Math.sin(angle) * 20 * pulse,
                centerY + Math.cos(angle) * 20 * pulse,
                radius * pulse,
                0,
                Math.PI * 2
            );
            
            const gradient = ctx.createRadialGradient(
                centerX, centerY, radius * 0.2,
                centerX, centerY, radius
            );
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3 + 10 * (1 - progress);
            ctx.stroke();
        }
    },

    fractal: function() {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxSize = Math.min(width, height) * 0.8;
        const layers = parseInt(complexityInput.value);
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        const speed = parseFloat(speedInput.value);
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        for (let i = 0; i < layers; i++) {
            const progress = i / layers;
            const size = maxSize * (1 - progress);
            const rotation = time * speed * (0.5 + progress);
            const petals = 5 + Math.floor(progress * 15);
            const hueShift = time * speed * 20;
            
            ctx.save();
            ctx.rotate(rotation);
            
            for (let j = 0; j < petals; j++) {
                const angle = (j / petals) * Math.PI * 2;
                const petalSize = size * (0.3 + 0.7 * Math.sin(time + j));
                
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.ellipse(
                    Math.cos(angle) * size * 0.5,
                    Math.sin(angle) * size * 0.5,
                    petalSize * 0.3,
                    petalSize * 0.7,
                    angle,
                    0,
                    Math.PI * 2
                );
                
                const r = Math.floor(parseInt(color1.slice(1, 3), 16) * (1 - progress) + parseInt(color2.slice(1, 3), 16) * progress);
                const g = Math.floor(parseInt(color1.slice(3, 5), 16) * (1 - progress) + parseInt(color2.slice(3, 5), 16) * progress);
                const b = Math.floor(parseInt(color1.slice(5, 7), 16) * (1 - progress) + parseInt(color2.slice(5, 7), 16) * progress);
                
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.7 - progress * 0.5})`;
                ctx.fill();
            }
            
            ctx.restore();
        }
        
        ctx.restore();
    },

    tunnel: function() {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxSize = Math.min(width, height) * 0.9;
        const steps = 30;
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        const speed = parseFloat(speedInput.value);
        const complexity = parseInt(complexityInput.value);
        
        for (let i = 0; i < steps; i++) {
            const progress = i / steps;
            const size = maxSize * (1 - progress);
            const rotation = time * speed * (1 + progress * 2);
            const sides = 3 + Math.floor(progress * complexity);
            const pulse = 0.7 + 0.3 * Math.sin(time * speed * 3 + progress * 10);
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.scale(pulse, pulse);
            
            ctx.beginPath();
            for (let j = 0; j <= sides; j++) {
                const angle = (j / sides) * Math.PI * 2;
                const x = Math.cos(angle) * size * 0.5;
                const y = Math.sin(angle) * size * 0.5;
                
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            const gradient = ctx.createLinearGradient(0, -size/2, 0, size/2);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2 + 10 * progress;
            ctx.stroke();
            
            ctx.restore();
        }
    },

    wave: function() {
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        const speed = parseFloat(speedInput.value);
        const complexity = parseInt(complexityInput.value);
        const waveCount = complexity;
        const amplitude = height * 0.2;
        
        for (let i = 0; i < waveCount; i++) {
            const progress = i / waveCount;
            const yOffset = height * 0.1 + (height * 0.8) * progress;
            const frequency = 0.01 + 0.05 * progress;
            const waveSpeed = speed * (0.5 + progress);
            
            ctx.beginPath();
            for (let x = 0; x <= width; x += 5) {
                const y = yOffset + amplitude * Math.sin(x * frequency + time * waveSpeed) * 
                          Math.sin(time * 0.5 + progress * Math.PI);
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            const r = Math.floor(parseInt(color1.slice(1, 3), 16) * (1 - progress) + parseInt(color2.slice(1, 3), 16) * progress);
            const g = Math.floor(parseInt(color1.slice(3, 5), 16) * (1 - progress) + parseInt(color2.slice(3, 5), 16) * progress);
            const b = Math.floor(parseInt(color1.slice(5, 7), 16) * (1 - progress) + parseInt(color2.slice(5, 7), 16) * progress);
            
            ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.lineWidth = 2 + 8 * (1 - progress);
            ctx.stroke();
        }
    },

    mandala: function() {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxSize = Math.min(width, height) * 0.45;
        const layers = parseInt(complexityInput.value);
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        const speed = parseFloat(speedInput.value);
        
        for (let i = 0; i < layers; i++) {
            const progress = i / layers;
            const size = maxSize * (0.2 + 0.8 * progress);
            const rotation = time * speed * (1 - progress);
            const elements = 5 + Math.floor(progress * 15);
            const pulse = 0.7 + 0.3 * Math.sin(time * speed * 2 + progress * 10);
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.scale(pulse, pulse);
            
            for (let j = 0; j < elements; j++) {
                const angle = (j / elements) * Math.PI * 2;
                const x = Math.cos(angle) * size * 0.7;
                const y = Math.sin(angle) * size * 0.7;
                const elementSize = size * (0.1 + 0.2 * Math.sin(time + j));
                
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle + time * speed * 0.5);
                
                ctx.beginPath();
                for (let k = 0; k < 5; k++) {
                    const subAngle = (k / 5) * Math.PI * 2;
                    const subRadius = elementSize * (0.3 + 0.7 * (k % 2));
                    const subX = Math.cos(subAngle) * subRadius;
                    const subY = Math.sin(subAngle) * subRadius;
                    
                    if (k === 0) {
                        ctx.moveTo(subX, subY);
                    } else {
                        ctx.lineTo(subX, subY);
                    }
                }
                ctx.closePath();
                
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, elementSize);
                gradient.addColorStop(0, color1);
                gradient.addColorStop(1, color2);
                
                ctx.fillStyle = gradient;
                ctx.fill();
                
                ctx.restore();
            }
            
            ctx.restore();
        }
    }
};

function draw() {
    // Clear canvas with semi-transparent black for motion trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw selected pattern
    const pattern = patternSelect.value;
    if (patterns[pattern]) {
        patterns[pattern]();
    }
}

function animate() {
    time += 0.016; // Roughly 60fps
    
    draw();
    
    if (isCapturing) {
        capturer.capture(canvas);
        const elapsed = Date.now() - captureStartTime;
        if (elapsed >= 7000) { // 7 seconds
            stopCapture();
        }
    }
    
    requestAnimationFrame(animate);
}

// Video capture functions
function startCapture() {
    if (isCapturing) return;
    
    isCapturing = true;
    captureStartTime = Date.now();
    capturer = new CCapture({ 
        format: 'webm',
        framerate: 60,
        quality: 90,
        verbose: true
    });
    capturer.start();
    captureBtn.disabled = true;
    downloadBtn.disabled = true;
}

function stopCapture() {
    if (!isCapturing) return;
    
    isCapturing = false;
    capturer.stop();
    capturer.save((blob) => {
        downloadUrl = URL.createObjectURL(blob);
        downloadBtn.disabled = false;
        captureBtn.disabled = false;
    });
}

// Event listeners
patternSelect.addEventListener('change', draw);
color1Input.addEventListener('input', draw);
color2Input.addEventListener('input', draw);
speedInput.addEventListener('input', draw);
complexityInput.addEventListener('input', draw);

captureBtn.addEventListener('click', startCapture);
downloadBtn.addEventListener('click', () => {
    if (downloadUrl) {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `psychedelic-${patternSelect.value}-${Date.now()}.webm`;
        a.click();
    }
});

// Initialize
resizeCanvas();
animate();
