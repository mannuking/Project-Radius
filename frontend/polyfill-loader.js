// This script ensures polyfills are loaded correctly
// Dynamically detect if we need to polyfill process
if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
  // Log that we're loading polyfills
  console.debug('Loading Node.js polyfills for browser environment');
  
  // Load process/browser polyfill
  import('process/browser').then(processPolyfill => {
    window.process = processPolyfill.default;
    console.debug('Process polyfill loaded', window.process);
  }).catch(err => {
    console.error('Failed to load process polyfill:', err);
  });

  // Load buffer polyfill
  import('buffer').then(bufferPolyfill => {
    window.Buffer = bufferPolyfill.Buffer;
    console.debug('Buffer polyfill loaded');
  }).catch(err => {
    console.error('Failed to load buffer polyfill:', err);
  });
} 
