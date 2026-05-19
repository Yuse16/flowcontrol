const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src');

const replacements = [
  { regex: /\btext-white\b(?! dark:)/g, replace: 'text-gray-900 dark:text-white' },
  { regex: /\btext-gray-400\b(?! dark:)/g, replace: 'text-gray-600 dark:text-gray-400' },
  { regex: /\btext-gray-300\b(?! dark:)/g, replace: 'text-gray-700 dark:text-gray-300' },
  { regex: /\btext-gray-200\b(?! dark:)/g, replace: 'text-gray-800 dark:text-gray-200' },
  { regex: /\bbg-black\b(?! dark:)/g, replace: 'bg-white dark:bg-black' },
  { regex: /\bbg-black\/50\b(?! dark:)/g, replace: 'bg-white/70 dark:bg-black/50' },
  { regex: /\bbg-black\/40\b(?! dark:)/g, replace: 'bg-white/50 dark:bg-black/40' },
  { regex: /\bbg-black\/30\b(?! dark:)/g, replace: 'bg-white/40 dark:bg-black/30' },
  { regex: /\border-white\/5\b(?! dark:)/g, replace: 'border-gray-200 dark:border-white/5' },
  { regex: /\border-white\/10\b(?! dark:)/g, replace: 'border-gray-300 dark:border-white/10' },
  { regex: /\bbg-white\/5\b(?! dark:)/g, replace: 'bg-black/5 dark:bg-white/5' },
  { regex: /\bbg-white\/10\b(?! dark:)/g, replace: 'bg-black/10 dark:bg-white/10' },
  { regex: /\bg-white\/\[0\.02\]\b(?! dark:)/g, replace: 'bg-black/[0.02] dark:bg-white/[0.02]' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replace);
      }
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(targetDir);
console.log("Migration complete!");
