#!/usr/bin/env node

/**
 * MediExplain AI — Live Public Tunnel Runner
 * Exposes http://localhost:3000 to a public HTTPS tunnel for testing:
 * 1. Live Camera Scanner on real mobile devices (requires HTTPS for navigator.mediaDevices)
 * 2. WebAuthn biometric passkey authentication on smartphones
 * 3. WhatsApp dose reminder webhook callbacks
 */

import { spawn } from 'child_process';
import http from 'http';

const PORT = process.env.PORT || 3000;

console.log('═══════════════════════════════════════════════════════════');
console.log('🌐 MediExplain AI — Mobile Device Live HTTPS Tunnel');
console.log(`📡 Local Target: http://localhost:${PORT}`);
console.log('═══════════════════════════════════════════════════════════\n');

// Check if local Next.js dev server is reachable
const req = http.get(`http://localhost:${PORT}/api/health`, (res) => {
  console.log(`✅ Local MediExplain server is running (HTTP ${res.statusCode})`);
  launchTunnel();
});

req.on('error', () => {
  console.log('⚠️  Local dev server is not detected on port 3000.');
  console.log('💡 Tip: In another terminal, run: npm run dev\n');
  console.log('Starting HTTPS tunnel anyway...');
  launchTunnel();
});

function launchTunnel() {
  console.log('🚀 Initiating Cloudflare HTTPS Tunnel via untun...\n');
  const tunnelProcess = spawn('npx', ['-y', 'untun@latest', 'tunnel', `http://localhost:${PORT}`], {
    shell: true,
    stdio: 'inherit',
  });

  tunnelProcess.on('exit', (code) => {
    console.log(`\nTunnel closed with exit code: ${code}`);
  });
}
