const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace class glass -> card
    content = content.replace(/\bglass\b/g, 'card');
    content = content.replace(/\bglass-card\b/g, 'card');

    // Replace primary-X with mapped colors
    content = content.replace(/primary-100\/40/g, 'text-muted');
    content = content.replace(/primary-100\/30/g, 'text-muted');
    content = content.replace(/primary-100\/20/g, 'text-muted');
    content = content.replace(/primary-100\/35/g, 'text-muted');
    content = content.replace(/primary-100/g, 'text-primary');
    
    // Convert text colors
    content = content.replace(/text-primary-500/g, 'text-[var(--accent-purple)]');
    content = content.replace(/text-primary-400/g, 'text-[var(--accent-purple)]');
    content = content.replace(/text-primary-300/g, 'text-[var(--accent-purple)]');
    content = content.replace(/text-accent-400/g, 'text-[var(--accent-cyan)]');
    content = content.replace(/text-accent-500/g, 'text-[var(--accent-cyan)]');
    content = content.replace(/text-accent-700/g, 'text-[var(--accent-cyan)]');

    content = content.replace(/bg-primary-500/g, 'bg-[var(--accent-purple)]');
    content = content.replace(/bg-accent-500/g, 'bg-[var(--accent-cyan)]');

    content = content.replace(/border-primary-500\/[0-9]+/g, 'border-[var(--border)]');
    content = content.replace(/border-primary-500/g, 'border-[var(--accent-purple)]');
    
    // Shadows
    content = content.replace(/shadow-\[0_0_.*\]/g, 'shadow-[0_0_20px_var(--accent-glow)]');

    // Gradient text
    content = content.replace(/text-primary-grad/g, 'text-gradient');
    content = content.replace(/text-accent-grad/g, 'text-gradient');
    content = content.replace(/text-hero-grad/g, 'text-gradient');

    // Buttons
    content = content.replace(/btn-outline-primary/g, 'btn-ghost');

    fs.writeFileSync(filePath, content, 'utf8');
  }
});

console.log('Done replacing classes');
