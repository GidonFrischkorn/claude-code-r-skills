#!/usr/bin/env node
/**
 * Documentation File Warning Hook
 *
 * Warns when Claude tries to create random .md or .txt files,
 * encouraging consolidation into README.md or CLAUDE.md.
 * Runs as PreToolUse hook on Write tool calls.
 */

const { log } = require('./utils');

const ALLOWED = /(README|CLAUDE|AGENTS|CONTRIBUTING|SKILL)\.md$/;
const DOC_PATTERN = /\.(md|txt)$/;

let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const filePath = input.tool_input?.file_path || '';
    if (DOC_PATTERN.test(filePath) && !ALLOWED.test(filePath)) {
      log('[Hook] WARNING: Creating documentation file: ' + filePath);
      log('[Hook] Consider consolidating docs in README.md or CLAUDE.md');
    }
  } catch (e) {
    // Ignore parse errors - allow tool call to proceed
  }
  process.exit(0);
});
