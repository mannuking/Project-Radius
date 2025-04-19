// Custom process polyfill
window.process = window.process || {};
window.process.env = window.process.env || {};
window.process.browser = true; 
