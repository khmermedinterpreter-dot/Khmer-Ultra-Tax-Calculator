/**
 * Vite dev-server plugin that exposes a local API to add/update/delete
 * Borey entries directly in the province TypeScript source files.
 *
 * Endpoints:
 *   POST /api/borey/add     – add or update a Borey in the matching province file
 *   POST /api/borey/delete  – delete a Borey from the matching province file
 *
 * Request body (JSON): a Borey object with at minimum:
 *   { developer, project, province, district, locationNote, marketValue, baseValue }
 *
 * The plugin locates the correct province file by matching the `province` field
 * to the province-to-file mapping, then rewrites the `boreys: [...]` array.
 */

import fs from 'fs';
import path from 'path';
import type { Plugin, ViteDevServer } from 'vite';

// Map province names to their file paths (relative to project root)
const PROVINCE_FILE_MAP: Record<string, string> = {
  'រាជធានីភ្នំពេញ': 'data/provinces/phnom-penh.ts',
  'ខេត្តកណ្តាល': 'data/provinces/kandal.ts',
  'ខេត្តព្រះសីហនុ': 'data/provinces/sihanoukville.ts',
  'ខេត្តកំពត': 'data/provinces/kampot.ts',
  'ខេត្តកំពង់ស្ពឺ': 'data/provinces/kampong-speu.ts',
  'ខេត្តកំពង់ឆ្នាំង': 'data/provinces/kampong-chhnang.ts',
  'ខេត្តកំពង់ចាម': 'data/provinces/kampong-cham.ts',
  'ខេត្តបាត់ដំបង': 'data/provinces/battambang.ts',
  'ខេត្តព្រៃវែង': 'data/provinces/prey-veng.ts',
};

interface BoreyPayload {
  developer: string;
  project: string;
  province: string;
  district: string;
  locationNote: string;
  marketValue: number;
  baseValue: number;
}

/** Read request body as JSON from an IncomingMessage */
function readBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: string) => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

/**
 * Format a single Borey object as a TypeScript object literal string (one line),
 * matching the style used in the existing province files.
 */
function formatBoreyLine(b: BoreyPayload): string {
  return `    { developer: ${JSON.stringify(b.developer)}, project: ${JSON.stringify(b.project)}, province: ${JSON.stringify(b.province)}, district: ${JSON.stringify(b.district)}, locationNote: ${JSON.stringify(b.locationNote)}, marketValue: ${b.marketValue}, baseValue: ${b.baseValue} },`;
}

/**
 * Parse all Borey entries from the raw array content string.
 * Each entry is a single `{ ... }` object literal.
 */
function parseBoreyEntries(arrayContent: string): BoreyPayload[] {
  const entries: BoreyPayload[] = [];
  // Match each { ... } block in the array
  const objRegex = /\{[^{}]+\}/g;
  let match;
  while ((match = objRegex.exec(arrayContent)) !== null) {
    const objStr = match[0];
    // Extract fields using regex (handles both quoted and unquoted keys)
    const getStr = (key: string): string => {
      const m = new RegExp(`${key}\\s*:\\s*"([^"]*)"`, 's').exec(objStr);
      return m ? m[1] : '';
    };
    const getNum = (key: string): number => {
      const m = new RegExp(`${key}\\s*:\\s*(\\d+)`).exec(objStr);
      return m ? parseInt(m[1], 10) : 0;
    };
    entries.push({
      developer: getStr('developer'),
      project: getStr('project'),
      province: getStr('province'),
      district: getStr('district'),
      locationNote: getStr('locationNote'),
      marketValue: getNum('marketValue'),
      baseValue: getNum('baseValue'),
    });
  }
  return entries;
}

/**
 * Locate the `boreys: [` ... `]` block in the file content.
 * Returns [startIndex, endIndex] where startIndex is just after `[`
 * and endIndex is the position of the matching `]`.
 */
function findBoreysArrayBounds(content: string): [number, number] {
  const match = /boreys\s*:\s*\[/.exec(content);
  if (!match) throw new Error('Could not find boreys:[ in the file');
  const start = match.index + match[0].length; // right after '['
  let depth = 1;
  let i = start;
  while (i < content.length && depth > 0) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') depth--;
    i++;
  }
  return [start, i - 1]; // i-1 is the position of the closing ']'
}

/**
 * Rebuild the boreys array content from an array of entries,
 * preserving any comments that existed in the original.
 */
function rebuildArrayContent(entries: BoreyPayload[]): string {
  if (entries.length === 0) return '\n  ';
  const lines = entries.map(b => formatBoreyLine(b));
  return '\n' + lines.join('\n') + '\n  ';
}

function isSameBorey(a: BoreyPayload, b: BoreyPayload): boolean {
  return a.project === b.project && a.province === b.province && a.district === b.district;
}

export function boreyApiPlugin(): Plugin {
  return {
    name: 'borey-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        // Only handle our API routes
        if (!req.url?.startsWith('/api/borey/')) return next();

        const action = req.url.replace('/api/borey/', '').split('?')[0]; // 'add' or 'delete'
        if (!['add', 'delete'].includes(action)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: `Unknown action: ${action}` }));
          return;
        }

        try {
          const payload: BoreyPayload = await readBody(req);

          // Determine which file to modify
          const relPath = PROVINCE_FILE_MAP[payload.province];
          if (!relPath) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: `Unknown province: ${payload.province}` }));
            return;
          }

          const absPath = path.resolve(server.config.root, relPath);
          if (!fs.existsSync(absPath)) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: `File not found: ${relPath}` }));
            return;
          }

          // Read file
          let content = fs.readFileSync(absPath, 'utf-8');

          // Find the boreys array
          const [arrStart, arrEnd] = findBoreysArrayBounds(content);
          const arrayContent = content.slice(arrStart, arrEnd);

          // Parse existing entries
          let entries = parseBoreyEntries(arrayContent);

          if (action === 'add') {
            // Add or update
            const existingIdx = entries.findIndex(e => isSameBorey(e, payload));
            if (existingIdx >= 0) {
              entries[existingIdx] = payload;
            } else {
              entries.push(payload);
            }
          } else if (action === 'delete') {
            const before = entries.length;
            entries = entries.filter(e => !isSameBorey(e, payload));
            if (entries.length === before) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Borey not found' }));
              return;
            }
          }

          // Rebuild the array and write the file
          const newArrayContent = rebuildArrayContent(entries);
          const newContent = content.slice(0, arrStart) + newArrayContent + content.slice(arrEnd);
          fs.writeFileSync(absPath, newContent, 'utf-8');

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, action, file: relPath, totalBoreys: entries.length }));
        } catch (err: any) {
          console.error('[borey-api]', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}
