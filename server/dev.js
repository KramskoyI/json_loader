import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';

const serverProcess = spawn(process.execPath, ['./server/index.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
});

const clientProcess = isWindows
  ? spawn('cmd.exe', ['/c', 'npm.cmd', 'run', 'dev:client'], {
      cwd: process.cwd(),
      stdio: 'inherit',
    })
  : spawn('npm', ['run', 'dev:client'], {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

const processes = [serverProcess, clientProcess];

function stopAll(exitCode = 0) {
  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(exitCode);
}

for (const child of processes) {
  child.on('exit', (code) => {
    stopAll(code ?? 0);
  });
}

process.on('SIGINT', () => stopAll());
process.on('SIGTERM', () => stopAll());
