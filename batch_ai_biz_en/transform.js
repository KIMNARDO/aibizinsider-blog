// Transform existing navy/orange posts to emerald AI_BIZ_EN scheme

function colorSwap(html) {
  const replacements = [
    // Navy primaries -> emerald dark
    [/#1a365d/gi, '#022c22'],
    [/#2a4a7f/gi, '#064e3b'],
    [/#0f2845/gi, '#022c22'],
    [/#1a2e4a/gi, '#064e3b'],
    [/#0a1628/gi, '#022c22'],
    // Orange accents -> emerald bright
    [/#dd6b20/gi, '#10b981'],
    [/#c05621/gi, '#065f46'],
    [/#c53030/gi, '#065f46'],
    [/#e53e3e/gi, '#065f46'],
    [/#fb923c/gi, '#34d399'],
    [/#f97316/gi, '#10b981'],
    [/#fbbf24/gi, '#6ee7b7'],
    [/#f59e0b/gi, '#10b981'],
    // Light oranges -> emerald light
    [/#fffaf0/gi, '#ecfdf5'],
    [/#fff7ed/gi, '#ecfdf5'],
    [/#fff8e1/gi, '#ecfdf5'],
    [/#fef3c7/gi, '#d1fae5'],
    [/#fed7d7/gi, '#d1fae5'],
    [/#fed7aa/gi, '#d1fae5'],
    [/#fbd38d/gi, '#6ee7b7'],
    [/#fff5f5/gi, '#ecfdf5'],
    // Light navy bg -> emerald light
    [/#ebf4ff/gi, '#ecfdf5'],
    [/#f7fafc/gi, '#f0fdf4'],
    [/#f8f9fb/gi, '#f0fdf4'],
    [/#f8fafc/gi, '#f0fdf4'],
    [/#f9fafb/gi, '#f0fdf4'],
    // Borders/dividers
    [/#d2dae8/gi, '#d1fae5'],
    [/#d9e1ea/gi, '#d1fae5'],
    [/#e2e8f0/gi, '#d1fae5'],
    [/#e8ecf1/gi, '#d1fae5'],
    [/#eee(?=[;"'])/gi, '#d1fae5'],
    // Dark orange text
    [/#744210/gi, '#064e3b'],
    [/#92400e/gi, '#065f46'],
    [/#78350f/gi, '#064e3b'],
    [/#7c2d12/gi, '#064e3b'],
    [/#822727/gi, '#7f1d1d'],
    // Greens
    [/#22543d/gi, '#064e3b'],
    [/#c6f6d5/gi, '#d1fae5'],
    [/#fefcbf/gi, '#d1fae5'],
    // Gray text unchanged (#333, #334155, #8a94a6, etc.)
    // Gradients
    [/linear-gradient\(135deg,\s*#022c22\s*0%,\s*#ecfdf5\s*100%\)/gi, 'linear-gradient(135deg,#022c22 0%,#064e3b 100%)'],
    [/linear-gradient\(135deg,\s*#f0fdf4\s*0%,\s*#ecfdf5\s*100%\)/gi, 'linear-gradient(135deg,#022c22 0%,#064e3b 100%)'],
  ];
  for (const [re, rep] of replacements) html = html.replace(re, rep);
  return html;
}

function buildKeyTakeawaysBox(bullets, title) {
  const items = bullets.slice(0, 5).map(b =>
    `<li style="margin-bottom:12px;font-size:15px;line-height:1.8;color:#e2e8f0;padding-left:0;">
      <span style="color:#34d399;font-weight:700;margin-right:8px;">&#9654;</span><span style="color:#e2e8f0;">${b}</span>
    </li>`
  ).join('\n');
  return `<div style="background:linear-gradient(135deg,#022c22 0%,#064e3b 100%);border-radius:16px;padding:28px 32px;margin:0 0 28px 0;box-shadow:0 4px 24px rgba(2,44,34,0.18);">
  <div style="font-size:12px;color:#6ee7b7;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;margin-bottom:12px;">KEY TAKEAWAYS</div>
  <p style="font-weight:700;font-size:20px;color:#6ee7b7;margin:0 0 16px 0;line-height:1.35;">${title}</p>
  <ul style="margin:0;padding-left:20px;list-style:none;">
${items}
  </ul>
</div>`;
}

function buildFooter(dateStr) {
  return `<div style="background:#022c22;border-radius:12px;padding:24px 28px;text-align:center;margin:32px 0 0 0;">
  <p style="font-size:14px;color:#6ee7b7;font-weight:600;margin:0 0 6px 0;">AI Biz Insider</p>
  <p style="font-size:13px;color:#a7f3d0;margin:0 0 4px 0;">AI Business &middot; aibizinsider.com</p>
  <p style="font-size:12px;color:#34d399;margin:0;">${dateStr}</p>
</div>`;
}

// Extract headline bullets from "Today's Headlines" or similar list
function extractBullets(html) {
  // Look for ul after "Today's Headlines" / "Headlines"
  const re = /Today[^<]{0,20}Headlines<\/[^>]+>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i;
  const m = html.match(re);
  if (!m) return [];
  const lis = [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(x =>
    x[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  );
  return lis;
}

function extractSubtitle(html) {
  // orange colored subtitle
  const m = html.match(/color:\s*#(?:dd6b20|10b981)[^"']*"[^>]*>([^<]{20,200})</);
  return m ? m[1].trim() : '';
}

function transform(rawContent, title, link) {
  // Step 1: color swap
  let html = colorSwap(rawContent);

  // Step 2: extract bullets for Key Takeaways
  const bullets = extractBullets(rawContent);

  // Step 3: build Key Takeaways box and prepend after hero image
  const keyBox = bullets.length
    ? buildKeyTakeawaysBox(bullets, title.replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"'))
    : '';

  // Insert key takeaways box AFTER the first <figure> (hero image) if found
  if (keyBox) {
    const figEnd = html.indexOf('</figure>');
    if (figEnd !== -1) {
      html = html.slice(0, figEnd + 9) + '\n' + keyBox + '\n' + html.slice(figEnd + 9);
    } else {
      html = keyBox + '\n' + html;
    }
  }

  // Step 4: append footer before closing wrapper div
  // The content ends with </div>\n. Inject footer before final </div>
  const lastDiv = html.lastIndexOf('</div>');
  const dateMatch = link.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
  const dateStr = dateMatch
    ? `Published ${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]} | aibizinsider.com`
    : 'aibizinsider.com';
  const footer = buildFooter(dateStr);
  if (lastDiv !== -1) {
    html = html.slice(0, lastDiv) + '\n' + footer + '\n' + html.slice(lastDiv);
  } else {
    html = html + '\n' + footer;
  }

  return `<!-- wp:html -->\n${html}\n<!-- /wp:html -->`;
}

module.exports = { transform };

if (require.main === module) {
  const fs = require('fs');
  const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const out = transform(input.content, input.title, input.link);
  fs.writeFileSync(process.argv[3], out);
  console.log('wrote', process.argv[3], out.length, 'bytes');
}
