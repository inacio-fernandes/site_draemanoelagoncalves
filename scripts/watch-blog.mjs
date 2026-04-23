import { watch } from 'node:fs';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scriptPath = path.join(rootDir, 'scripts', 'generate-blog-index.mjs');
const contentDir = path.join(rootDir, 'content', 'blog');

let timer = null;
let running = false;
let rerunRequested = false;

function runGenerator() {
  if (running) {
    rerunRequested = true;
    return;
  }

  running = true;
  const child = execFile(process.execPath, [scriptPath], { cwd: rootDir });

  child.stdout?.on('data', chunk => process.stdout.write(chunk));
  child.stderr?.on('data', chunk => process.stderr.write(chunk));

  child.on('exit', code => {
    running = false;
    if (code !== 0) {
      console.error(`Blog generator exited with code ${code}`);
    }

    if (rerunRequested) {
      rerunRequested = false;
      runGenerator();
    }
  });
}

function scheduleRun() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    runGenerator();
  }, 150);
}

console.log(`Watching ${contentDir} for blog changes...`);
runGenerator();

watch(contentDir, { recursive: true }, (eventType, filename) => {
  if (!filename) {
    scheduleRun();
    return;
  }

  if (filename === 'index.json') {
    return;
  }

  if (filename.endsWith('.md')) {
    console.log(`Detected ${eventType} in ${filename}`);
    scheduleRun();
  }
});
