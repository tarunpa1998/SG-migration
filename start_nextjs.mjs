import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

// Set environment variables
process.env.API_BASE_URL = 'http://localhost:5000';
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:5000';

console.log('Starting Next.js app on port 3000...');

// Run Next.js
const nextProcess = spawn('npx', ['next', 'dev', '-p', '3000'], {
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (error) => {
  console.error(`Failed to start Next.js process: ${error.message}`);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
});
