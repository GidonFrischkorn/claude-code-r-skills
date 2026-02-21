#!/usr/bin/env node
/**
 * Git Push Warning Hook
 *
 * Warns before git push to prevent accidental pushes.
 * Runs as PreToolUse hook on Bash tool calls.
 */

const { log } = require('./utils');

let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const cmd = input.tool_input?.command || '';
    if (/git\s+push/.test(cmd)) {
      log('[Hook] WARNING: About to run: ' + cmd.trim());
      log('[Hook] Confirm this push is intentional before proceeding.');
    }
  } catch (e) {
    // Ignore parse errors - allow tool call to proceed
  }
  process.exit(0);
});
