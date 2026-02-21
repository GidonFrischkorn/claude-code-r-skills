#!/usr/bin/env node
/**
 * Documentation File Warning Hook
 *
 * Warns when Claude tries to create random .md or .txt files,
 * encouraging consolidation into README.md or CLAUDE.md.
 * Runs as PreToolUse hook on Write tool calls.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { log } = require('./utils');

const ALLOWED = /(README|CLAUDE|AGENTS|CONTRIBUTING|SKILL)\.md$/;
const DOC_PATTERN = /\.(md|txt)$/;
const diagFile = path.join(os.tmpdir(), 'claude-doc-blocker-diag.txt');

function diag(msg) {
  fs.appendFileSync(diagFile, new Date().toISOString() + ' ' + msg + '\n');
}

diag('hook started');

try {
  const data = fs.readFileSync(0, 'utf8');
  diag('stdin read ok, length=' + data.length);
  const input = JSON.parse(data);
  const filePath = input.tool_input?.file_path || '';
  diag('filePath=' + filePath);
  if (DOC_PATTERN.test(filePath) && !ALLOWED.test(filePath)) {
    log('[Hook] WARNING: Creating documentation file: ' + filePath);
    log('[Hook] Consider consolidating docs in README.md or CLAUDE.md');
    diag('warning logged');
  }
} catch (e) {
  diag('error: ' + e.message);
  log('[Hook] doc-blocker error: ' + e.message);
}

diag('hook done');
process.exit(0);
