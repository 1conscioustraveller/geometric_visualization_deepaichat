// pattern-worker.js
self.onmessage = function(e) {
  const { pattern, time, width, height, params } = e.data;
  let result;
  
  // Offload heavy calculations
  switch(pattern) {
    case 'fractal':
      result = calculateFractal(time, width, height, params);
      break;
    case 'mandala':
      result = calculateMandala(time, width, height, params);
      break;
  }
  
  self.postMessage(result);
};

function calculateFractal(/*...*/) {
  // Move ALL fractal math here
  return { paths: [...] }; // Simplified data
}

function calculateMandala(/*...*/) {
  // Move ALL mandala math here
  return { shapes: [...] };
}
