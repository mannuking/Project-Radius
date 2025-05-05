// Polyfill for node:process
if (typeof window !== 'undefined') {
  // Import the browser process polyfill
  import('process/browser').then(processPolyfill => {
    // Ensure process is available on the window
    window.process = window.process || processPolyfill.default;
  }).catch(err => {
    console.error('Error loading process polyfill:', err);
  });
}

// Re-export Buffer for use in browser
import { Buffer } from 'buffer';
export { Buffer }; 
