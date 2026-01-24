const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'dist/admin');
const targetDir = 'S:\\Project\\FCGameServer\\public';

console.log(`Starting copy from ${sourceDir} to ${targetDir}...`);

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
    console.log(`Creating target directory: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
}

function copyFileSync(source, target) {
    let targetFile = target;
    if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
        targetFile = path.join(target, path.basename(source));
    }
    fs.copyFileSync(source, targetFile);
    console.log(`Copied ${source} -> ${targetFile}`);
}

function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const files = fs.readdirSync(source);
    files.forEach(file => {
        const curSource = path.join(source, file);
        const curTarget = path.join(target, file);
        if (fs.lstatSync(curSource).isDirectory()) {
            copyFolderSync(curSource, curTarget);
        } else {
            copyFileSync(curSource, curTarget);
        }
    });
}

// Copy index.html
const indexHtmlSource = path.join(sourceDir, 'index.html');
const indexHtmlTarget = path.join(targetDir, 'index.html');

if (fs.existsSync(indexHtmlSource)) {
    copyFileSync(indexHtmlSource, indexHtmlTarget);
} else {
    console.error(`Error: Source file not found: ${indexHtmlSource}`);
}

// Copy static directory
const staticSource = path.join(sourceDir, 'static');
const staticTarget = path.join(targetDir, 'static');

if (fs.existsSync(staticSource)) {
    // Remove existing static directory in target to ensure clean copy?
    // User didn't ask for clean copy, but usually it's safer to avoid stale files.
    // For now, I'll just overwrite/add.
    console.log(`Copying static directory...`);
    copyFolderSync(staticSource, staticTarget);
    console.log(`Copied directory ${staticSource} -> ${staticTarget}`);
} else {
    console.error(`Error: Source directory not found: ${staticSource}`);
}

console.log('Copy operation completed.');