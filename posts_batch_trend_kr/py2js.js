// Parse the Python POSTS dict from posts_data.py and write posts_data.json
const fs = require('fs');
const path = require('path');

let src = fs.readFileSync(path.join(__dirname, 'posts_data.py'), 'utf8');

// Remove comment lines and docstrings
src = src.replace(/^\s*#.*$/gm, '');
src = src.replace(/^\s*""".*?"""\s*$/gms, '');

// Grab POSTS assignments: POSTS[NNN] = { ... }
// Build a JS object by evaluating safely. We'll transform Python-only tokens:
//   - single-quoted strings are okay for JSON? No, JSON needs double quotes.
//   - tuples ( 'a', 'b' ) → arrays [ 'a', 'b' ]

// Simpler: eval as JS after transforming.
// Python bool: True/False/None -> true/false/null
src = src.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');

// Collect assignments and build a JS program
let js = 'var POSTS = {};\n';
// Replace "POSTS[562] = {" style assignments - they already work in JS if keys are numeric
js += src;
js += '\nmodule.exports = POSTS;\n';

// But we still have tuple parentheses around (label, url). In JS those become grouping. We need arrays.
// Replace (\s*'([^']*)',\s*'([^']+)'\s*) patterns in 'sources' and 'related' lists with [..., ...]
// Easier: regex for (  'x',  'y' )  -> [ 'x', 'y' ]
js = js.replace(/\(\s*('[^']*'|"[^"]*")\s*,\s*('[^']*'|"[^"]*")\s*\)/g, '[$1, $2]');

fs.writeFileSync(path.join(__dirname, 'posts_data.tmp.js'), js, 'utf8');

const POSTS = require('./posts_data.tmp.js');
// write JSON
const jsonStr = JSON.stringify(POSTS, null, 2);
fs.writeFileSync(path.join(__dirname, 'posts_data.json'), jsonStr, 'utf8');
console.log('wrote posts_data.json, post count:', Object.keys(POSTS).length);
