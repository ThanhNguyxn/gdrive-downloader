const fs = require('fs');
const path = require('path');

const newVersion = process.argv[2];

if (!newVersion) {
    console.error('❌ Please provide a version number. Usage: npm run set-version <version>');
    process.exit(1);
}

if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
    console.error('❌ Invalid version format. Please use X.Y.Z (e.g., 2.0.1)');
    process.exit(1);
}

console.log(`🚀 Updating project to version ${newVersion}...`);

const rootDir = path.resolve(__dirname, '..');

// 1. Update package.json
const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = require(packageJsonPath);
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('✅ Updated package.json');

// 2. Update manifest.json
const manifestPath = path.join(rootDir, 'extension', 'manifest.json');
const manifest = require(manifestPath);
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('✅ Updated extension/manifest.json');

// 3. Update popup.html
const popupHtmlPath = path.join(rootDir, 'extension', 'popup', 'popup.html');
let popupHtml = fs.readFileSync(popupHtmlPath, 'utf8');
// Regex to replace content inside <span class="version">...</span>
popupHtml = popupHtml.replace(
    /(<span class="version">).*?(<\/span>)/,
    `$1v${newVersion} Premium$2`
);
fs.writeFileSync(popupHtmlPath, popupHtml);
console.log('✅ Updated extension/popup/popup.html');

// 4. Update README.md
const readmePath = path.join(rootDir, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');

// Update Badge: version-2.0.0-blue
readme = readme.replace(
    /img\.shields\.io\/badge\/version-[\d\.]+-blue/,
    `img.shields.io/badge/version-${newVersion}-blue`
);

// Update Download Link: gdrive-downloader-v2.0.1.zip
readme = readme.replace(
    /gdrive-downloader-v[\d\.]+\.zip/g,
    `gdrive-downloader-v${newVersion}.zip`
);

// Update Download Badge Text: Download_v2.0.1
readme = readme.replace(
    /Download_v[\d\.]+-Click_Here/,
    `Download_v${newVersion}-Click_Here`
);

fs.writeFileSync(readmePath, readme);
console.log('✅ Updated README.md');

console.log('\n✨ Version update complete!');
console.log('⚠️  Don\'t forget to update RELEASE_NOTES.md manually with the changelog!');
