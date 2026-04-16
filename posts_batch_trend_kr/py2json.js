// Convert posts_data.py to posts_data.json by simple parsing
// Actually, easier: rewrite posts_data as JS then dump JSON.
const fs = require('fs');
const path = require('path');

// We need to manually construct JSON. Instead load a JS-authored version.
require('./posts_data_js.js');
