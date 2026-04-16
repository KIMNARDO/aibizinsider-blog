// Build styled HTML for all 19 AI_TREND_KR posts
const fs = require('fs');
const path = require('path');

const H2 = 'font-size:28px;font-weight:700;color:#1e1b4b;border-bottom:3px solid #8b5cf6;padding-bottom:10px;margin:36px 0 20px 0;';
const H3 = 'font-size:20px;font-weight:700;color:#5b21b6;border-left:4px solid #a78bfa;padding-left:14px;margin:28px 0 14px 0;';
const P = 'font-size:16px;line-height:1.9;color:#334155;';
const BADGE = 'display:inline-block;background:#5b21b6;color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:4px;margin-bottom:12px;';
const LINK = 'color:#7c3aed;font-size:14px;text-decoration:none;border-bottom:1px solid #a78bfa;';

function build(d, related) {
  const parts = [];
  parts.push('<!-- wp:html -->');
  parts.push('<div style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 100%);border-radius:16px;padding:32px 36px;margin:0 0 32px 0;box-shadow:0 6px 24px rgba(30,27,75,0.22);">');
  parts.push('  <div style="font-size:12px;color:#a78bfa;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;margin-bottom:14px;">TL;DR</div>');
  parts.push(`  <p style="font-weight:800;font-size:22px;color:#ffffff;margin:0 0 14px 0;line-height:1.35;border-left:4px solid #8b5cf6;padding-left:16px;">${d.title}</p>`);
  parts.push(`  <p style="font-size:15px;color:#a78bfa;font-weight:600;margin:0 0 16px 0;">${d.subtitle}</p>`);
  parts.push('  <ul style="margin:0;padding-left:20px;list-style:none;">');
  for (const b of d.tldr) {
    parts.push(`    <li style="margin-bottom:10px;font-size:15px;line-height:1.85;color:#c4b5fd;padding-left:4px;">${b}</li>`);
  }
  parts.push('  </ul>');
  parts.push('</div>');
  parts.push('<!-- /wp:html -->');

  parts.push('<!-- wp:separator {"style":{"color":{"background":"#e2e8f0"}}} -->');
  parts.push('<hr class="wp-block-separator has-text-color has-background" style="background-color:#e2e8f0;border-color:#e2e8f0"/>');
  parts.push('<!-- /wp:separator -->');

  parts.push('<!-- wp:heading {"level":2} -->');
  parts.push(`<h2 style="${H2}">핵심 이슈 심층 분석</h2>`);
  parts.push('<!-- /wp:heading -->');

  for (const sec of d.sections) {
    parts.push('<!-- wp:heading {"level":3} -->');
    parts.push(`<h3 style="${H3}">${sec.h3}</h3>`);
    parts.push('<!-- /wp:heading -->');

    if (sec.date_badge) {
      parts.push('<!-- wp:html -->');
      parts.push(`<div style="${BADGE}">${sec.date_badge}</div>`);
      parts.push('<!-- /wp:html -->');
    }
    for (const para of sec.paragraphs) {
      parts.push('<!-- wp:paragraph -->');
      parts.push(`<p style="${P}">${para}</p>`);
      parts.push('<!-- /wp:paragraph -->');
    }
    if (sec.insight) {
      parts.push('<!-- wp:html -->');
      parts.push('<div style="background:#ede9fe;border-left:4px solid #8b5cf6;border-radius:0 12px 12px 0;padding:20px 24px;margin:20px 0 28px 0;">');
      parts.push('  <p style="font-weight:700;color:#5b21b6;margin:0 0 10px 0;font-size:15px;">Trend Insight</p>');
      parts.push(`  <p style="font-size:15px;line-height:1.8;color:#5b21b6;margin:0;">${sec.insight}</p>`);
      parts.push('</div>');
      parts.push('<!-- /wp:html -->');
    }
    parts.push('<!-- wp:separator {"style":{"color":{"background":"#e2e8f0"}}} -->');
    parts.push('<hr class="wp-block-separator has-text-color has-background" style="background-color:#e2e8f0;border-color:#e2e8f0"/>');
    parts.push('<!-- /wp:separator -->');
  }

  parts.push('<!-- wp:heading {"level":2} -->');
  parts.push(`<h2 style="${H2}">출처</h2>`);
  parts.push('<!-- /wp:heading -->');
  parts.push('<!-- wp:html -->');
  parts.push('<div style="background:#f8fafc;border:1px solid #c4b5fd;border-radius:12px;padding:24px;margin:0 0 28px 0;">');
  parts.push('  <ul style="margin:0;padding-left:18px;">');
  for (const [label, url] of d.sources) {
    parts.push(`    <li style="margin-bottom:10px;font-size:15px;line-height:1.7;"><a href="${url}" target="_blank" rel="noopener noreferrer" style="${LINK}">${label}</a></li>`);
  }
  parts.push('  </ul>');
  parts.push('</div>');
  parts.push('<!-- /wp:html -->');

  parts.push('<!-- wp:heading {"level":2} -->');
  parts.push(`<h2 style="${H2}">관련 글</h2>`);
  parts.push('<!-- /wp:heading -->');
  parts.push('<!-- wp:html -->');
  parts.push('<div style="background:#f8fafc;border:1px solid #c4b5fd;border-radius:12px;padding:24px;margin:0 0 40px 0;">');
  parts.push('  <ul style="margin:0;padding-left:18px;">');
  for (const [label, url] of related) {
    parts.push(`    <li style="margin-bottom:10px;font-size:15px;line-height:1.7;"><a href="${url}" target="_blank" rel="noopener noreferrer" style="${LINK}">${label}</a></li>`);
  }
  parts.push('  </ul>');
  parts.push('</div>');
  parts.push('<!-- /wp:html -->');

  parts.push('<!-- wp:separator {"style":{"color":{"background":"#e2e8f0"}}} -->');
  parts.push('<hr class="wp-block-separator has-text-color has-background" style="background-color:#e2e8f0;border-color:#e2e8f0"/>');
  parts.push('<!-- /wp:separator -->');
  parts.push('<!-- wp:html -->');
  parts.push('<div style="background:#1e1b4b;border-radius:12px;padding:24px 28px;margin:32px 0 0 0;text-align:center;">');
  parts.push('  <p style="font-size:13px;color:#a78bfa;margin:0;letter-spacing:0.04em;">AI Biz Insider · AI 트렌드 · aibizinsider.com</p>');
  parts.push(`  <p style="font-size:12px;color:#6d6aaa;margin:8px 0 0 0;">${d.footer_date}</p>`);
  parts.push('</div>');
  parts.push('<!-- /wp:html -->');

  return parts.join('\n\n');
}

const RELATED_POOL = [
  ['AI 에이전트 도구 생태계 재편 — MCP, multica, Axios, Shopify (2026-04-11)', 'https://aibizinsider.com/2026/04/11/ai-agent-tools-mcp-multica-axios-shopify-april-11-2026/'],
  ['AI 개발 도구 모니터링 자동화 시대 (2026-04-10 저녁)', 'https://aibizinsider.com/2026/04/10/ai-dev-monitoring-claude-openai-gemini-apr-10/'],
  ['AI 에이전트 아키텍처 전환 — Advisor 패턴, Gemini 3D, OpenAI Frontier (2026-04-10)', 'https://aibizinsider.com/2026/04/10/ai-agent-architecture-advisor-gemini-openai-meta-april-10-2026/'],
  ['Claude Managed Agents 공개 (2026-04-09 저녁)', 'https://aibizinsider.com/2026/04/09/claude-managed-agents-2026-04-09-evening/'],
  ['AI 에이전트 전면화 — Claude Mythos, OpenAI 엔터프라이즈, Gemma 4 (2026-04-09)', 'https://aibizinsider.com/2026/04/09/ai-agent-claude-mythos-openai-enterprise-gemma4-april-9-2026/'],
  ['Claude Mythos 프리뷰 공개 — Glasswing, GLM-5.1, agent-skills (2026-04-08)', 'https://aibizinsider.com/2026/04/08/claude-mythos-glasswing-glm51-agent-skills-april-8-2026/'],
];

function pickRelated(selfUrl, n = 3) {
  const out = [];
  for (const [label, url] of RELATED_POOL) {
    if (url === selfUrl) continue;
    out.push([label, url]);
    if (out.length >= n) break;
  }
  return out;
}

const POST_URLS = {
  562: 'https://aibizinsider.com/2026/04/10/tesla-korea-price-increase-apr-2026/',
  560: 'https://aibizinsider.com/2026/04/10/ai-dev-monitoring-claude-openai-gemini-apr-10/',
  555: 'https://aibizinsider.com/2026/04/10/ai-agent-architecture-advisor-gemini-openai-meta-april-10-2026/',
  547: 'https://aibizinsider.com/2026/04/09/claude-managed-agents-2026-04-09-evening/',
  543: 'https://aibizinsider.com/2026/04/09/ai-agent-claude-mythos-openai-enterprise-gemma4-april-9-2026/',
  535: 'https://aibizinsider.com/2026/04/08/ai-agent-orchestration-scion-goclaw-april-8-2026-evening/',
  530: 'https://aibizinsider.com/2026/04/08/claude-mythos-glasswing-glm51-agent-skills-april-8-2026/',
  507: 'https://aibizinsider.com/2026/04/07/ai-dev-tools-styleseed-attie-insforge-april-7-2026-evening/',
  503: 'https://aibizinsider.com/2026/04/07/ai-governance-turning-point-anthropic-openai-claude-code-april-7-2026/',
  490: 'https://aibizinsider.com/2026/04/06/ai-efficiency-offline-llm-token-reduction-ai-coding-april-2026/',
  481: 'https://aibizinsider.com/2026/04/05/ai-agent-emotion-prompt-agentnews-gemini-migration-april-2026-evening/',
  474: 'https://aibizinsider.com/2026/04/05/ai-code-agent-linux-vulnerability-goose-llm/',
  461: 'https://aibizinsider.com/2026/04/04/openai-codex-pricing-gradient-labs-google-vids/',
  460: 'https://aibizinsider.com/2026/04/04/cohere-korean-asr-claude-subscription-vercel/',
  287: 'https://aibizinsider.com/2026/04/03/cursor-3-qwen-copilot-sdk-gemini-flex-ai-dev-tools/',
  280: 'https://aibizinsider.com/2026/04/03/openai-122b-gemma-4-1bit-llm-weekly/',
  252: 'https://aibizinsider.com/2026/04/02/openai-122t-funding-google-ai-1bit-llm/',
  228: 'https://aibizinsider.com/2026/04/01/openai-122b-veo-3-1-claude-code-leak-apr-1/',
  225: 'https://aibizinsider.com/2026/04/01/openai-122b-claude-code-qwen-apr-1-2026/',
};

const POSTS = require('./posts_data.json');

const outdir = __dirname;
for (const pid of Object.keys(POSTS)) {
  const d = POSTS[pid];
  const selfUrl = POST_URLS[pid] || '';
  const related = pickRelated(selfUrl, 3);
  const html = build(d, related);
  const outpath = path.join(outdir, `post_${pid}.html`);
  fs.writeFileSync(outpath, html, 'utf8');
  console.log(`wrote ${outpath} (${html.length} chars)`);
}
