const fs = require('fs');

// Read the current homepage to extract reusable parts
const current = fs.readFileSync('C:/00.AI개발/워드프레스블로그관리/homepage-current.html', 'utf8');

// Extract hero section
const heroStart = current.indexOf('<section style="position:relative;background:linear-gradient(120deg');
const heroEnd = current.indexOf('</section>', heroStart) + '</section>'.length;
const heroSection = current.substring(heroStart, heroEnd);

// Extract category navigation cards section
const catNavStart = current.indexOf('<section style="margin-bottom:80px;">\n  <div style="display:flex;');
const catNavEnd = current.indexOf('</section>', catNavStart) + '</section>'.length;
const catNavSection = current.substring(catNavStart, catNavEnd);

// Extract marquee section
const marqueeStart = current.indexOf('<section style="margin-bottom:72px;padding:32px 0;border-top');
const marqueeEnd = current.indexOf('</section>', marqueeStart) + '</section>'.length;
const marqueeSection = current.substring(marqueeStart, marqueeEnd);

// Extract newsletter section
const newsletterStart = current.indexOf('<section style="margin-bottom:56px;position:relative;background:linear-gradient');
const newsletterEnd = current.indexOf('</section>', newsletterStart) + '</section>'.length;
const newsletterSection = current.substring(newsletterStart, newsletterEnd);

// Extract footer section (from "ABOUT" section to end)
const footerStart = current.indexOf('<section style="margin-bottom:32px;padding:40px 36px;background:#f8fafc');
const footerEndMarker = current.indexOf('<!-- /wp:html -->');
const footerSection = current.substring(footerStart, footerEndMarker);

// Extract style block (everything before abi-wrap div)
const styleEnd = current.indexOf('<div class="abi-wrap"');
const styleBlock = current.substring(0, styleEnd);

// Update hero section: change POSTS count to 120+
const updatedHero = heroSection.replace(
  /<div style="font-family:var\(--abi-serif\);font-size:26px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">111<\/div>/,
  '<div style="font-family:var(--abi-serif);font-size:26px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">120+</div>'
);

// Post data
const posts = [
  { id:1110, title:'AI 에이전트 성공률 1년 만에 4배...스탠퍼드 423페이지가 말하는 현실 — Digest 04/16', cat:'Tech Digest', catLabel:'TECH DIGEST', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-biz-insider-69d9c1a60fb90.png', link:'/2026/04/16/stanford-ai-index-linux-7-claude-code-digest/', date:'2026.04.16', accent:'#22c55e', darkBg:'#052e16' },
  { id:1069, title:'같은 날 같은 걸 냈다...OpenAI와 Google 사이에 무슨 일이?', cat:'AI Trends EN', catLabel:'AI TRENDS', img:'https://aibizinsider.com/wp-content/uploads/2026/04/openai-gpt-update-thumbnail.png', link:'/2026/04/16/openai-agents-sdk-sandbox-harness-subagents/', date:'2026.04.16', accent:'#06b6d4', darkBg:'#0c4a6e' },
  { id:1068, title:'4개월 만에 매출 3배...Anthropic이 한 짓', cat:'AI Business EN', catLabel:'AI BUSINESS', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-business-strategy-thumbnail-4.png', link:'/2026/04/16/anthropic-usage-based-billing-30b-arr-compute-crunch/', date:'2026.04.16', accent:'#10b981', darkBg:'#022c22' },
  { id:1067, title:'13GB로 GPT-4 이겼다는 모델...써봤더니 소름 — Digest 04/16', cat:'Tech Digest', catLabel:'TECH DIGEST', img:'https://aibizinsider.com/wp-content/uploads/2026/04/tech-digest-weekly-thumbnail.png', link:'/2026/04/16/tech-digest-supergemma4-openai-oauth-agent-bench/', date:'2026.04.16', accent:'#22c55e', darkBg:'#052e16' },
  { id:1066, title:'마케팅팀 전원 해고됐습니다. 이유가 소름입니다', cat:'AI 비즈니스', catLabel:'AI 비즈니스', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-job-market-thumbnail.png', link:'/2026/04/16/hightouch-100m-arr-ai-marketing-agents-martech/', date:'2026.04.16', accent:'#fbbf24', darkBg:'#0a1628' },
  { id:1065, title:'Mac 유저 전원 해당. Google이 어제 한 짓', cat:'AI Trends EN', catLabel:'AI TRENDS', img:'https://aibizinsider.com/wp-content/uploads/2026/04/google-gemini-launch-thumbnail.png', link:'/2026/04/16/google-gemini-mac-app-native-swift-desktop-ai/', date:'2026.04.16', accent:'#06b6d4', darkBg:'#0c4a6e' },
  { id:1064, title:'27년간 숨어있던 버그, AI가 하루 만에 찾아버림 — 보안업계 멘탈 초토화', cat:'AI 트렌드', catLabel:'AI 트렌드', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-cybersecurity-thumbnail.png', link:'/2026/04/16/project-glasswing-claude-mythos-cybersecurity-100m/', date:'2026.04.16', accent:'#a78bfa', darkBg:'#1e1b4b' },
  { id:1063, title:'월 20만원 공짜로 준다는데 아직도 안 받았어요? — 청년월세 5/29 마감', cat:'정부정책', catLabel:'정부정책', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-regulation-policy-thumbnail.png', link:'/2026/04/16/2026-youth-rent-support-monthly-application/', date:'2026.04.16', accent:'#ef4444', darkBg:'#450a0a' },
  { id:1062, title:'사장님 아직도 모르세요? 오늘부터 전기요금 15원 내렸는데요', cat:'정부정책', catLabel:'정부정책', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-economy-impact-thumbnail.png', link:'/2026/04/16/korea-industrial-electricity-tariff-reform-april-16-2026/', date:'2026.04.16', accent:'#ef4444', darkBg:'#450a0a' },
  { id:1061, title:'Anthropic 신모델 떡밥 하나에 Adobe 주가 곤두박질 — 디자이너 진짜 끝?', cat:'Tech Digest', catLabel:'TECH DIGEST', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-chip-race-thumbnail.png', link:'/2026/04/16/tech-digest-top3-2026-04-16/', date:'2026.04.16', accent:'#22c55e', darkBg:'#052e16' },
  { id:1054, title:'정부24가 그렇게 쓰레기였던 진짜 이유...정부가 직접 인정함', cat:'정부정책', catLabel:'정부정책', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-education-thumbnail.png', link:'/2026/04/16/korea-gov24-plus-domain-redesign-2026/', date:'2026.04.16', accent:'#ef4444', darkBg:'#450a0a' },
  { id:1052, title:'백준 죽는다 — 16년 쓴 개발자들 "아 진짜요?" (Digest 04/15)', cat:'Tech Digest', catLabel:'TECH DIGEST', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-art-creativity-thumbnail.png', link:'/2026/04/15/tech-digest-top3-kt-sla-boj-happy-2026-04-15/', date:'2026.04.15', accent:'#22c55e', darkBg:'#052e16' },
  { id:1049, title:'원폭 만든 천재 둘 다 비참한 최후 — 지금 AI 업계랑 판박이', cat:'AI 비즈니스', catLabel:'AI 비즈니스', img:'https://aibizinsider.com/wp-content/uploads/2026/04/nlp-language-models-thumbnail.png', link:'/2026/04/15/oppenheimer-teller-ai-race-sagikkun-column-2026-04/', date:'2026.04.15', accent:'#fbbf24', darkBg:'#0a1628' },
  { id:1048, title:'"공장에 AI 얼마예요?" — 견적 4개 뜯었더니 가격 차이 미쳤다', cat:'AI 비즈니스', catLabel:'AI 비즈니스', img:'https://aibizinsider.com/wp-content/uploads/2026/04/robotics-manufacturing-thumbnail.png', link:'/2026/04/15/on-premise-llm-comparison-manufacturing-korea-2026-04/', date:'2026.04.15', accent:'#fbbf24', darkBg:'#0a1628' },
  { id:1047, title:"23% to 93% Overnight — Google's Robot Was Blind Yesterday, Not Anymore", cat:'AI Trends EN', catLabel:'AI TRENDS', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-healthcare-thumbnail.png', link:'/2026/04/15/gemini-robotics-er-1-6-embodied-ai-2026-04-15/', date:'2026.04.15', accent:'#06b6d4', darkBg:'#0c4a6e' },
  { id:1042, title:'Chrome Is Now an AI Agent — Google Just Made Browsers Obsolete', cat:'AI Business EN', catLabel:'AI BUSINESS', img:'https://aibizinsider.com/wp-content/uploads/2026/04/cloud-computing-ai-thumbnail.png', link:'/2026/04/15/google-chrome-ai-skills-workflow-2026-04-15/', date:'2026.04.15', accent:'#10b981', darkBg:'#022c22' },
  { id:1041, title:'"852조는 뻥임" 투자자 폭탄선언 — OpenAI 밸류 거품론 급발진', cat:'AI 비즈니스', catLabel:'AI 비즈니스', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-startup-funding-thumbnail.png', link:'/2026/04/15/anthropic-380b-vs-openai-852b-investor-doubt-2026-04-15/', date:'2026.04.15', accent:'#fbbf24', darkBg:'#0a1628' },
  { id:1034, title:'Anthropic Investors Got Dethroned — And They Signed Up for It', cat:'AI Trends EN', catLabel:'AI TRENDS', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-finance-trading-thumbnail.png', link:'/2026/04/15/anthropic-ltbt-board-majority-narasimhan-2026-04-15/', date:'2026.04.15', accent:'#06b6d4', darkBg:'#0c4a6e' },
  { id:1033, title:'투자자가 이사회에서 쫓겨남 — Anthropic이 벌인 AI 업계 첫 쿠데타', cat:'AI 트렌드', catLabel:'AI 트렌드', img:'https://aibizinsider.com/wp-content/uploads/2026/04/quantum-computing-ai-thumbnail.png', link:'/2026/04/15/anthropic-narasimhan-board-ltbt-majority-2026-04-15/', date:'2026.04.15', accent:'#a78bfa', darkBg:'#1e1b4b' },
  { id:1032, title:'당장 통장 확인 — 고유가 지원금 60만원 27일부터 꽂힘', cat:'정부정책', catLabel:'정부정책', img:'https://aibizinsider.com/wp-content/uploads/2026/04/ai-climate-tech-thumbnail.png', link:'/2026/04/15/korea-high-oil-price-relief-fund-april-27-2026/', date:'2026.04.15', accent:'#ef4444', darkBg:'#450a0a' },
];

const baseUrl = 'https://aibizinsider.com';

function heroCard(p) {
  return `<a href="${baseUrl}${p.link}" class="abi-hero-card" style="grid-row:span 2;display:block;text-decoration:none;color:inherit;position:relative;border-radius:20px;overflow:hidden;background:#0f172a;aspect-ratio:4/5;">
  <img src="${p.img}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.55;transition:transform 0.6s;"/>
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(10,22,40,0.75) 70%,rgba(10,22,40,0.95) 100%);"></div>
  <div style="position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:36px;color:#fff;">
    <span class="abi-chip" style="display:inline-flex;align-items:center;gap:6px;background:${p.accent}22;color:${p.accent};border:1px solid ${p.accent}55;padding:5px 12px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;align-self:flex-start;margin-bottom:14px;">${p.catLabel}</span>
    <h3 style="font-family:var(--abi-serif);font-size:32px;font-weight:700;line-height:1.25;color:#fff;margin:0 0 12px 0;letter-spacing:-0.01em;">${p.title}</h3>
    <div style="display:flex;align-items:center;gap:10px;font-size:13px;color:#94a3b8;font-variant-numeric:tabular-nums;">
      <span>${p.date}</span>
      <span style="opacity:0.4;">\u2014</span>
      <span style="color:${p.accent};font-weight:600;">READ \u2197</span>
    </div>
  </div>
</a>`;
}

function postCard(p) {
  return `<a href="${baseUrl}${p.link}" class="abi-post-card" style="display:block;text-decoration:none;color:inherit;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;transition:transform 0.25s ease,box-shadow 0.25s ease;">
  <div style="position:relative;aspect-ratio:16/9;background:${p.darkBg};overflow:hidden;">
    <img src="${p.img}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;"/>
    <span class="abi-chip" style="position:absolute;top:14px;left:14px;background:${p.accent};color:${p.darkBg};padding:4px 10px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">${p.catLabel}</span>
  </div>
  <div style="padding:20px 22px 22px;">
    <h3 style="font-family:var(--abi-serif);font-size:19px;font-weight:700;line-height:1.35;color:#0f172a;margin:0 0 8px 0;letter-spacing:-0.01em;min-height:52px;">${p.title}</h3>
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #f1f5f9;">
      <span style="font-size:12px;color:#94a3b8;font-variant-numeric:tabular-nums;letter-spacing:0.05em;">${p.date}</span>
      <span style="font-size:12px;color:${p.accent};font-weight:700;letter-spacing:0.05em;">READ \u2192</span>
    </div>
  </div>
</a>`;
}

function compactCard(p) {
  return `<a href="${baseUrl}${p.link}" class="abi-compact-card" style="display:grid;grid-template-columns:120px 1fr;gap:16px;text-decoration:none;color:inherit;padding:12px;border-radius:12px;transition:background 0.2s;">
  <div style="position:relative;aspect-ratio:1;background:${p.darkBg};border-radius:10px;overflow:hidden;">
    <img src="${p.img}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>
  </div>
  <div style="display:flex;flex-direction:column;justify-content:center;">
    <span style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:${p.accent};text-transform:uppercase;margin-bottom:6px;">${p.catLabel}</span>
    <h4 style="font-family:var(--abi-serif);font-size:15px;font-weight:600;line-height:1.4;color:#0f172a;margin:0 0 6px 0;letter-spacing:-0.005em;">${p.title}</h4>
    <span style="font-size:11.5px;color:#94a3b8;font-variant-numeric:tabular-nums;">${p.date}</span>
  </div>
</a>`;
}

// Filter posts by category
const aiBiz = posts.filter(p => p.cat === 'AI 비즈니스');
const aiTrend = posts.filter(p => p.cat === 'AI 트렌드');
const aiBizEN = posts.filter(p => p.cat === 'AI Business EN');
const aiTrendsEN = posts.filter(p => p.cat === 'AI Trends EN');
const techDigest = posts.filter(p => p.cat === 'Tech Digest');
const policy = posts.filter(p => p.cat === '정부정책');

function buildCatSection(title, subtitle, accent, viewUrl, catPosts) {
  const top4 = catPosts.slice(0, 4);
  return `<section style="margin-bottom:72px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
    <div style="display:flex;align-items:center;gap:14px;">
      <span style="display:inline-block;width:4px;height:28px;background:${accent};border-radius:2px;"></span>
      <div>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.2em;color:${accent};margin-bottom:3px;">${subtitle}</div>
        <h2 class="abi-section-title" style="font-family:var(--abi-serif);font-size:26px;font-weight:700;color:#0f172a;margin:0;letter-spacing:-0.02em;">${title}</h2>
      </div>
    </div>
    <a href="${viewUrl}" style="display:inline-flex;align-items:center;gap:6px;color:${accent};text-decoration:none;font-weight:600;font-size:13px;letter-spacing:0.02em;">\uc804\uccb4 \ubcf4\uae30 <span>\u2192</span></a>
  </div>
  <div class="abi-grid-2" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
    ${top4.map(p => compactCard(p)).join('\n')}
  </div>
</section>`;
}

// Build Latest section - post[0] as hero, [1-4] as medium cards
const latestSection = `<section id="latest" style="margin-bottom:80px;scroll-margin-top:80px;">
  <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px;padding-bottom:18px;border-bottom:2px solid #0f172a;">
    <div>
      <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#94a3b8;margin-bottom:8px;">LATEST \u00b7 \ucd5c\uc2e0</div>
      <h2 class="abi-section-title" style="font-family:var(--abi-serif);font-size:34px;font-weight:700;color:#0f172a;margin:0;letter-spacing:-0.02em;">\uc774\ubc88 \uc8fc \uc8fc\uc694 \uc774\uc288</h2>
    </div>
    <span style="font-size:13px;color:#64748b;font-variant-numeric:tabular-nums;">UPDATED \u00b7 2026.04.16</span>
  </div>
  <div class="abi-grid-hero" style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:22px;">
    ${heroCard(posts[0])}
    <div style="display:flex;flex-direction:column;gap:22px;">
      ${postCard(posts[1])}
${postCard(posts[2])}
    </div>
    <div style="display:flex;flex-direction:column;gap:22px;">
      ${postCard(posts[3])}
${postCard(posts[4])}
    </div>
  </div>
</section>`;

// Assemble full page
const fullPage = styleBlock +
  '<div class="abi-wrap" style="max-width:1200px;margin:0 auto;padding:0;color:#0f172a;">\n\n' +
  updatedHero + '\n\n' +
  catNavSection + '\n\n' +
  latestSection + '\n\n' +
  marqueeSection + '\n\n' +
  buildCatSection('AI \ube44\uc988\ub2c8\uc2a4', 'KOREAN \u00b7 \ud55c\uad6d\uc5b4', '#fbbf24',
    'https://aibizinsider.com/category/ai-%eb%b9%84%ec%a6%88%eb%8b%88%ec%8a%a4/', aiBiz) + '\n\n' +
  buildCatSection('AI \ud2b8\ub80c\ub4dc', 'KOREAN \u00b7 \ud55c\uad6d\uc5b4', '#a78bfa',
    'https://aibizinsider.com/category/ai-%ed%8a%b8%eb%a0%8c%eb%93%9c/', aiTrend) + '\n\n' +
  buildCatSection('AI Business & Trends', 'ENGLISH \u00b7 \uc601\ubb38\ud310', '#10b981',
    'https://aibizinsider.com/category/ai-business-en/', [...aiBizEN, ...aiTrendsEN]) + '\n\n' +
  buildCatSection('\uc815\ucc45 & \ubbfc\uc0dd', 'POLICY \u00b7 \uc815\ucc45 \ub9ac\ud3ec\ud2b8', '#ef4444',
    'https://aibizinsider.com/category/%ec%a0%95%ec%b1%85-%eb%af%bc%ec%83%9d/', policy) + '\n\n' +
  buildCatSection('Tech Digest', 'DIGEST \u00b7 \ub2e4\uc774\uc81c\uc2a4\ud2b8', '#22c55e',
    'https://aibizinsider.com/category/tech-digest/', techDigest) + '\n\n' +
  newsletterSection + '\n\n' +
  footerSection +
  '<!-- /wp:html -->';

fs.writeFileSync('C:/00.AI개발/워드프레스블로그관리/homepage-rebuild.html', fullPage, 'utf8');
console.log('Done! File size:', fullPage.length, 'bytes');
console.log('Category counts: aiBiz=' + aiBiz.length + ', aiTrend=' + aiTrend.length +
  ', aiBizEN=' + aiBizEN.length + ', aiTrendsEN=' + aiTrendsEN.length +
  ', techDigest=' + techDigest.length + ', policy=' + policy.length);
