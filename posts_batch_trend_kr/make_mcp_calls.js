// Output each post's raw content as escaped JSON string for inclusion in MCP calls
const fs = require('fs');
const path = require('path');
const ids = [228,252,280,287,460,461,474,481,490,503,507,530,535,543,547,555,560,562];
const outDir = path.join(__dirname, 'mcp_params');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
for (const id of ids) {
  const html = fs.readFileSync(path.join(__dirname, `post_${id}.html`), 'utf8');
  const params = {
    id: id,
    user_confirmed: 'yes',
    content: { raw: html }
  };
  fs.writeFileSync(path.join(outDir, `params_${id}.json`), JSON.stringify(params), 'utf8');
  console.log('wrote params_'+id+'.json');
}
