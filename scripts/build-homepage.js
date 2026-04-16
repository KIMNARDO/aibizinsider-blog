/**
 * aibizinsider.com - 홈페이지 고도화 빌더
 *
 * 최신 포스트를 API로 가져와 편집자 스타일 + Magic UI 감성의
 * 정적 HTML을 생성하고 Page 2에 업로드합니다.
 */

const https = require('https');

const TOKEN = process.env.WPCOM_TOKEN;
const SITE = 'aibizinsider.com';
const DRY_RUN = process.argv.includes('--dry-run');
const OUTPUT_FILE = process.argv.includes('--write-file') ? 'homepage-output.html' : null;

if (!TOKEN) { console.error('WPCOM_TOKEN 필요'); process.exit(1); }

function apiCall(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'public-api.wordpress.com',
      path: `/rest/v1.1/sites/${SITE}${path}`,
      method,
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
        } else reject(new Error(`${res.statusCode}: ${data.slice(0,300)}`));
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// 카테고리 메타
const CATS = {
  778080398: { name: 'AI 비즈니스', lang: 'KR', theme: 'gold', accent: '#fbbf24', dark: '#0a1628', bg1: '#0a1628', bg2: '#1a2e4a', slug: 'ai-%eb%b9%84%ec%a6%88%eb%8b%88%ec%8a%a4', archive: 'ai-%eb%b9%84%ec%a6%88%eb%8b%88%ec%8a%a4' },
  768858600: { name: 'AI 트렌드', lang: 'KR', theme: 'purple', accent: '#a78bfa', dark: '#1e1b4b', bg1: '#1e1b4b', bg2: '#312e81', slug: 'ai-%ed%8a%b8%eb%a0%8c%eb%93%9c' },
  788391959: { name: 'AI Business', lang: 'EN', theme: 'emerald', accent: '#10b981', dark: '#022c22', bg1: '#022c22', bg2: '#064e3b', slug: 'ai-business-en' },
  788391957: { name: 'AI Trends', lang: 'EN', theme: 'cyan', accent: '#06b6d4', dark: '#0c4a6e', bg1: '#0c4a6e', bg2: '#155e75', slug: 'ai-trends-en' },
  788391976: { name: 'Tech Digest', lang: 'EN', theme: 'green', accent: '#22c55e', dark: '#052e16', bg1: '#052e16', bg2: '#14532d', slug: 'tech-digest' },
  33592631:  { name: '정부정책', lang: 'KR', theme: 'red', accent: '#ef4444', dark: '#450a0a', bg1: '#450a0a', bg2: '#7f1d1d', slug: '%ec%a0%95%eb%b6%80%ec%a0%95%ec%b1%85' },
  788367641: { name: '정책 & 민생', lang: 'KR', theme: 'red', accent: '#ef4444', dark: '#450a0a', bg1: '#450a0a', bg2: '#7f1d1d', slug: '%ec%a0%95%ec%b1%85-%eb%af%bc%ec%83%9d' },
};

function primaryCatId(post) {
  const cats = Object.values(post.categories || {});
  for (const c of cats) if (CATS[c.ID]) return c.ID;
  return null;
}

function decode(s) {
  return (s || '').replace(/&#8217;/g, "'").replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '').trim();
}

function fmtDate(iso) {
  const d = new Date(iso);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${d.getFullYear()}.${String(m).padStart(2,'0')}.${String(day).padStart(2,'0')}`;
}

function clip(s, n) {
  s = decode(s);
  if (s.length <= n) return s;
  return s.slice(0, n).trimEnd() + '…';
}

async function fetchLatest(categoryIds, count) {
  const catParam = categoryIds ? `&category=${categoryIds}` : '';
  const fields = 'ID,title,URL,date,excerpt,categories,featured_image,post_thumbnail';
  const res = await apiCall(`/posts/?number=${count}${catParam}&status=publish&fields=${fields}`);
  const posts = res.posts || [];
  // featured_image 없는 포스트에 한해 content 추출로 fallback
  for (const p of posts) {
    if (!p.featured_image && !(p.post_thumbnail && p.post_thumbnail.URL)) {
      try {
        const full = await apiCall(`/posts/${p.ID}/?fields=content`);
        const m = (full.content || '').match(/<img[^>]+src=\"([^\"]+)\"/i);
        if (m) p.extracted_image = m[1];
      } catch(e) { /* 무시 */ }
    }
  }
  return posts;
}

const DEFAULT_COVER = 'https://aibizinsider.com/wp-content/uploads/2026/04/ai-biz-insider-69d9c1a60fb90.png';
function imgUrl(p) {
  return p.featured_image
      || (p.post_thumbnail && p.post_thumbnail.URL)
      || p.extracted_image
      || DEFAULT_COVER;
}

// === 렌더러들 ===

function renderCard_Hero(p) {
  const cat = CATS[primaryCatId(p)] || CATS[778080398];
  const img = imgUrl(p);
  const title = decode(p.title);
  const excerpt = clip(p.excerpt, 140);
  return `
<a href="${p.URL}" class="abi-hero-card" style="grid-row:span 2;display:block;text-decoration:none;color:inherit;position:relative;border-radius:20px;overflow:hidden;background:#0f172a;aspect-ratio:4/5;">
  ${img ? `<img src="${img}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.55;transition:transform 0.6s;"/>` : ''}
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(10,22,40,0.75) 70%,rgba(10,22,40,0.95) 100%);"></div>
  <div style="position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:36px;color:#fff;">
    <span class="abi-chip" style="display:inline-flex;align-items:center;gap:6px;background:${cat.accent}22;color:${cat.accent};border:1px solid ${cat.accent}55;padding:5px 12px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;align-self:flex-start;margin-bottom:14px;">${cat.name}</span>
    <h3 style="font-family:var(--abi-serif);font-size:32px;font-weight:700;line-height:1.25;color:#fff;margin:0 0 12px 0;letter-spacing:-0.01em;">${title}</h3>
    <p style="font-size:15px;line-height:1.7;color:#cbd5e1;margin:0 0 16px 0;">${excerpt}</p>
    <div style="display:flex;align-items:center;gap:10px;font-size:13px;color:#94a3b8;font-variant-numeric:tabular-nums;">
      <span>${fmtDate(p.date)}</span>
      <span style="opacity:0.4;">—</span>
      <span style="color:${cat.accent};font-weight:600;">READ ↗</span>
    </div>
  </div>
</a>`;
}

function renderCard_Standard(p) {
  const cat = CATS[primaryCatId(p)] || CATS[778080398];
  const img = imgUrl(p);
  const title = decode(p.title);
  const excerpt = clip(p.excerpt, 90);
  return `
<a href="${p.URL}" class="abi-post-card" style="display:block;text-decoration:none;color:inherit;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;transition:transform 0.25s ease,box-shadow 0.25s ease;">
  <div style="position:relative;aspect-ratio:16/9;background:${cat.dark};overflow:hidden;">
    ${img ? `<img src="${img}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;"/>` : ''}
    <span class="abi-chip" style="position:absolute;top:14px;left:14px;background:${cat.accent};color:${cat.dark};padding:4px 10px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">${cat.name}</span>
  </div>
  <div style="padding:20px 22px 22px;">
    <h3 style="font-family:var(--abi-serif);font-size:19px;font-weight:700;line-height:1.35;color:#0f172a;margin:0 0 8px 0;letter-spacing:-0.01em;min-height:52px;">${title}</h3>
    <p style="font-size:13.5px;line-height:1.65;color:#64748b;margin:0 0 14px 0;">${excerpt}</p>
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #f1f5f9;">
      <span style="font-size:12px;color:#94a3b8;font-variant-numeric:tabular-nums;letter-spacing:0.05em;">${fmtDate(p.date)}</span>
      <span style="font-size:12px;color:${cat.accent};font-weight:700;letter-spacing:0.05em;">READ →</span>
    </div>
  </div>
</a>`;
}

function renderCard_Compact(p) {
  const cat = CATS[primaryCatId(p)] || CATS[778080398];
  const img = imgUrl(p);
  const title = decode(p.title);
  return `
<a href="${p.URL}" class="abi-compact-card" style="display:grid;grid-template-columns:120px 1fr;gap:16px;text-decoration:none;color:inherit;padding:12px;border-radius:12px;transition:background 0.2s;">
  <div style="position:relative;aspect-ratio:1;background:${cat.dark};border-radius:10px;overflow:hidden;">
    ${img ? `<img src="${img}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>` : ''}
  </div>
  <div style="display:flex;flex-direction:column;justify-content:center;">
    <span style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:${cat.accent};text-transform:uppercase;margin-bottom:6px;">${cat.name}</span>
    <h4 style="font-family:var(--abi-serif);font-size:15px;font-weight:600;line-height:1.4;color:#0f172a;margin:0 0 6px 0;letter-spacing:-0.005em;">${clip(title, 70)}</h4>
    <span style="font-size:11.5px;color:#94a3b8;font-variant-numeric:tabular-nums;">${fmtDate(p.date)}</span>
  </div>
</a>`;
}

function renderCategoryCard(cat, count) {
  const langBadge = cat.lang === 'EN' ? 'ENGLISH' : 'KOREAN';
  return `
<a href="https://aibizinsider.com/category/${cat.slug}/" class="abi-cat-card" style="position:relative;display:block;text-decoration:none;color:inherit;border-radius:18px;overflow:hidden;min-height:200px;background:linear-gradient(135deg,${cat.bg1} 0%,${cat.bg2} 100%);padding:26px;">
  <span class="abi-beam" style="position:absolute;inset:0;border-radius:18px;padding:1.5px;background:linear-gradient(115deg,transparent 30%,${cat.accent}88 50%,transparent 70%);background-size:200% 100%;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;pointer-events:none;animation:abi-beam 6s linear infinite;"></span>
  <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:radial-gradient(circle,${cat.accent}22 0%,transparent 70%);border-radius:50%;pointer-events:none;"></div>
  <div style="position:relative;display:flex;flex-direction:column;height:100%;min-height:160px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:auto;">
      <span style="font-size:10px;font-weight:700;letter-spacing:0.16em;color:${cat.accent};">${langBadge}</span>
      <span style="font-size:11px;color:#cbd5e1;font-variant-numeric:tabular-nums;">${count} posts</span>
    </div>
    <div style="margin-top:28px;">
      <h3 style="font-family:var(--abi-serif);font-size:28px;font-weight:700;color:#fff;margin:0 0 6px 0;letter-spacing:-0.015em;">${cat.name}</h3>
      <div style="display:flex;align-items:center;gap:8px;margin-top:14px;">
        <div style="flex:1;height:1px;background:${cat.accent}44;"></div>
        <span style="color:${cat.accent};font-size:13px;font-weight:600;letter-spacing:0.05em;">VIEW →</span>
      </div>
    </div>
  </div>
</a>`;
}

// === HTML 조립 ===

function buildHTML(data) {
  const { totalPosts, latestPosts, kprBiz, kprTrend, enPosts, policyPosts, catCounts } = data;

  const styles = `
<style>
:root {
  --abi-sans: "Pretendard Variable", "Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  --abi-serif: "Pretendard Variable", "Pretendard", "Noto Serif KR", "Times New Roman", Georgia, serif;
  --abi-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
.abi-wrap, .abi-wrap * { font-family: var(--abi-sans); box-sizing: border-box; }
.abi-wrap h1, .abi-wrap h2, .abi-wrap h3, .abi-wrap h4 { font-family: var(--abi-serif); }

/* 테마 자동 렌더링 페이지 타이틀 시각적 숨김 — abi-wrap 앞 형제 선택 */
.abi-wrap-hide-parent-title ~ * .wp-block-post-title,
.wp-block-group:has(> .wp-block-post-title + .entry-content .abi-wrap) > .wp-block-post-title {
  display: none !important;
}

@keyframes abi-beam {
  0%   { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}
@keyframes abi-gradient {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes abi-shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
@keyframes abi-float {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-6px); }
}
@keyframes abi-marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes abi-pulse-dot {
  0%,100% { opacity: 1; transform: scale(1); }
  50%     { opacity: 0.6; transform: scale(0.9); }
}

.abi-post-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(15,23,42,0.08); }
.abi-post-card:hover img { transform: scale(1.05); }
.abi-compact-card:hover { background: #f8fafc; }
.abi-hero-card:hover img { transform: scale(1.06); }
.abi-cat-card { transition: transform 0.3s ease; }
.abi-cat-card:hover { transform: translateY(-4px); }

.abi-dotgrid {
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0);
  background-size: 24px 24px;
}
.abi-noise::before {
  content:""; position:absolute; inset:0; opacity:0.03; pointer-events:none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
}
.abi-shimmer-btn { position: relative; overflow: hidden; }
.abi-shimmer-btn::after {
  content:""; position: absolute; top:0; left:0; height:100%; width:40%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
  animation: abi-shimmer 3s ease-in-out infinite;
}

@media (max-width: 900px) {
  .abi-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
  .abi-hero-image { max-width: 340px; margin: 0 auto; }
}
@media (max-width: 768px) {
  .abi-hero-title { font-size: 38px !important; }
  .abi-section-title { font-size: 24px !important; }
  .abi-grid-hero { grid-template-columns: 1fr !important; }
  .abi-grid-3 { grid-template-columns: 1fr !important; }
  .abi-grid-2 { grid-template-columns: 1fr !important; }
  .abi-grid-cats { grid-template-columns: 1fr !important; }
}
</style>
<script>
(function(){
  // 홈페이지에서만 테마 자동 렌더링 페이지 타이틀·featured image 시각적 숨김 (SEO용 DOM 유지)
  if (location.pathname === '/' || location.pathname === '') {
    var hide = function() {
      var sel = '.wp-block-post-title, .entry-title, header.entry-header, .wp-block-post-featured-image';
      document.querySelectorAll(sel).forEach(function(el){
        // .abi-wrap 내부의 h1은 유지 (자체 Hero)
        if (!el.closest('.abi-wrap')) {
          el.style.cssText = 'position:absolute !important;width:1px !important;height:1px !important;padding:0 !important;margin:-1px !important;overflow:hidden !important;clip:rect(0,0,0,0) !important;white-space:nowrap !important;border:0 !important;';
        }
      });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hide);
    } else { hide(); }
  }
})();
</script>
`;

  // HERO (2-column: 좌측 텍스트 + 우측 브랜드 이미지)
  const hero = `
<section style="position:relative;background:linear-gradient(120deg,#0a0f1e 0%,#1a1b3a 45%,#0d1937 100%);background-size:200% 200%;animation:abi-gradient 18s ease infinite;border-radius:28px;padding:64px 56px;margin-bottom:72px;overflow:hidden;" class="abi-noise">
  <div class="abi-dotgrid" style="position:absolute;inset:0;opacity:0.5;"></div>
  <div style="position:absolute;top:-120px;right:-80px;width:460px;height:460px;background:radial-gradient(circle,rgba(251,191,36,0.14) 0%,transparent 60%);border-radius:50%;"></div>
  <div style="position:absolute;bottom:-140px;left:-100px;width:520px;height:520px;background:radial-gradient(circle,rgba(167,139,250,0.12) 0%,transparent 60%);border-radius:50%;"></div>
  <div class="abi-hero-grid" style="position:relative;display:grid;grid-template-columns:1.3fr 1fr;gap:56px;align-items:center;">
   <div style="min-width:0;">
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:28px;">
      <span style="display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:0.2em;color:#fbbf24;">
        <span style="width:6px;height:6px;background:#fbbf24;border-radius:50%;animation:abi-pulse-dot 2s ease-in-out infinite;"></span>
        LIVE · VOL. 4 / 2026
      </span>
      <span style="height:1px;flex:1;background:linear-gradient(90deg,#fbbf2455,transparent);max-width:180px;"></span>
    </div>
    <h1 class="abi-hero-title" style="font-family:var(--abi-serif);font-size:58px;font-weight:700;line-height:1.15;color:#fff;margin:0 0 24px 0;letter-spacing:-0.015em;word-break:keep-all;">매일의 AI를,<br/><span style="display:inline-block;padding:0 2px;background:linear-gradient(120deg,#fbbf24 0%,#f59e0b 40%,#a78bfa 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:abi-gradient 8s ease infinite;font-weight:800;">정확한 문장</span><span style="color:#fff;">으로.</span></h1>
    <p style="font-size:18px;line-height:1.75;color:#cbd5e1;margin:0 0 36px 0;max-width:680px;font-weight:400;">OpenAI · Anthropic · Google의 최신 움직임, 한국 정부 정책과 민생 가이드까지. 원문을 검증한 한 줄이 부풀린 열 줄보다 낫습니다.</p>
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
      <a href="#latest" class="abi-shimmer-btn" style="display:inline-flex;align-items:center;gap:8px;background:#fbbf24;color:#0a1628;padding:13px 26px;border-radius:100px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.02em;">오늘의 브리핑 <span style="font-size:16px;">→</span></a>
      <a href="https://aibizinsider.com/category/%ec%a0%95%ec%b1%85-%eb%af%bc%ec%83%9d/" style="display:inline-flex;align-items:center;gap:8px;color:#fff;padding:13px 22px;border-radius:100px;text-decoration:none;font-weight:500;font-size:14px;border:1px solid rgba(255,255,255,0.18);backdrop-filter:blur(10px);">정책 &amp; 민생 리포트</a>
    </div>
    <div style="display:flex;gap:36px;margin-top:48px;padding-top:28px;border-top:1px solid rgba(255,255,255,0.08);flex-wrap:wrap;">
      <div><div style="font-size:10px;font-weight:700;color:#64748b;letter-spacing:0.18em;margin-bottom:4px;">POSTS</div><div style="font-family:var(--abi-serif);font-size:26px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">${totalPosts}</div></div>
      <div><div style="font-size:10px;font-weight:700;color:#64748b;letter-spacing:0.18em;margin-bottom:4px;">CATEGORIES</div><div style="font-family:var(--abi-serif);font-size:26px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">7</div></div>
      <div><div style="font-size:10px;font-weight:700;color:#64748b;letter-spacing:0.18em;margin-bottom:4px;">CADENCE</div><div style="font-family:var(--abi-serif);font-size:26px;font-weight:700;color:#fff;">매일</div></div>
      <div><div style="font-size:10px;font-weight:700;color:#64748b;letter-spacing:0.18em;margin-bottom:4px;">LANGUAGES</div><div style="font-family:var(--abi-serif);font-size:26px;font-weight:700;color:#fff;">KO · EN</div></div>
    </div>
   </div>
   <div class="abi-hero-image" style="position:relative;min-width:0;">
    <div style="position:relative;border-radius:20px;overflow:hidden;aspect-ratio:1;box-shadow:0 30px 80px -20px rgba(0,0,0,0.5),0 0 0 1px rgba(251,191,36,0.1);">
      <img src="${DEFAULT_COVER}" alt="AI Biz Insider · 테크 및 비즈니스 인사이트" style="width:100%;height:100%;object-fit:cover;display:block;"/>
      <div style="position:absolute;inset:0;background:linear-gradient(135deg,transparent 50%,rgba(10,15,30,0.3) 100%);pointer-events:none;"></div>
      <span class="abi-beam" style="position:absolute;inset:0;border-radius:20px;padding:2px;background:linear-gradient(115deg,transparent 30%,rgba(251,191,36,0.6) 50%,transparent 70%);background-size:200% 100%;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;pointer-events:none;animation:abi-beam 6s linear infinite;"></span>
    </div>
    <div style="position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);background:#fbbf24;color:#0a1628;font-size:11px;font-weight:700;letter-spacing:0.14em;padding:8px 18px;border-radius:100px;white-space:nowrap;box-shadow:0 6px 20px rgba(251,191,36,0.35);">AI BIZ INSIDER</div>
   </div>
  </div>
</section>`;

  // 카테고리 그리드
  const catCards = [
    CATS[778080398], CATS[768858600], CATS[788391959],
    CATS[788391957], CATS[788367641], CATS[788391976],
  ].map(c => {
    const idForCount = c.name === '정책 & 민생' ? 788367641 : Object.keys(CATS).find(k => CATS[k].name === c.name);
    const count = catCounts[idForCount] || 0;
    return renderCategoryCard(c, count);
  }).join('');

  const categoryGrid = `
<section style="margin-bottom:80px;">
  <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px;gap:20px;flex-wrap:wrap;">
    <div>
      <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#94a3b8;margin-bottom:8px;">SECTIONS · 섹션</div>
      <h2 class="abi-section-title" style="font-family:var(--abi-serif);font-size:34px;font-weight:700;color:#0f172a;margin:0;letter-spacing:-0.02em;">주제별 탐색</h2>
    </div>
    <span style="font-size:13px;color:#64748b;">각 카테고리 아카이브에서 전체 글 확인</span>
  </div>
  <div class="abi-grid-cats" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;">
    ${catCards}
  </div>
</section>`;

  // 최신 포스트 (헤로 1개 + 표준 4개)
  const [heroPost, ...otherLatest] = latestPosts;
  const latestSection = `
<section id="latest" style="margin-bottom:80px;scroll-margin-top:80px;">
  <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px;padding-bottom:18px;border-bottom:2px solid #0f172a;">
    <div>
      <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#94a3b8;margin-bottom:8px;">LATEST · 최신</div>
      <h2 class="abi-section-title" style="font-family:var(--abi-serif);font-size:34px;font-weight:700;color:#0f172a;margin:0;letter-spacing:-0.02em;">이번 주 주요 이슈</h2>
    </div>
    <span style="font-size:13px;color:#64748b;font-variant-numeric:tabular-nums;">UPDATED · ${fmtDate(latestPosts[0] ? latestPosts[0].date : new Date().toISOString())}</span>
  </div>
  <div class="abi-grid-hero" style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:22px;">
    ${heroPost ? renderCard_Hero(heroPost) : ''}
    <div style="display:flex;flex-direction:column;gap:22px;">
      ${otherLatest.slice(0,2).map(renderCard_Standard).join('')}
    </div>
    <div style="display:flex;flex-direction:column;gap:22px;">
      ${otherLatest.slice(2,4).map(renderCard_Standard).join('')}
    </div>
  </div>
</section>`;

  // Per-category sections
  const sectionRow = (label, sublabel, cat, posts, linkHref) => `
<section style="margin-bottom:72px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
    <div style="display:flex;align-items:center;gap:14px;">
      <span style="display:inline-block;width:4px;height:28px;background:${cat.accent};border-radius:2px;"></span>
      <div>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.2em;color:${cat.accent};margin-bottom:3px;">${sublabel}</div>
        <h2 class="abi-section-title" style="font-family:var(--abi-serif);font-size:26px;font-weight:700;color:#0f172a;margin:0;letter-spacing:-0.02em;">${label}</h2>
      </div>
    </div>
    <a href="${linkHref}" style="display:inline-flex;align-items:center;gap:6px;color:${cat.accent};text-decoration:none;font-weight:600;font-size:13px;letter-spacing:0.02em;">전체 보기 <span>→</span></a>
  </div>
  <div class="abi-grid-2" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
    ${posts.slice(0,4).map(renderCard_Compact).join('')}
  </div>
</section>`;

  const bizSection = sectionRow('AI 비즈니스', 'KOREAN · 한국어', CATS[778080398], kprBiz, 'https://aibizinsider.com/category/ai-%eb%b9%84%ec%a6%88%eb%8b%88%ec%8a%a4/');
  const trendSection = sectionRow('AI 트렌드', 'KOREAN · 한국어', CATS[768858600], kprTrend, 'https://aibizinsider.com/category/ai-%ed%8a%b8%eb%a0%8c%eb%93%9c/');
  const enSection = sectionRow('AI Business & Trends', 'ENGLISH · 영문판', CATS[788391959], enPosts, 'https://aibizinsider.com/category/ai-business-en/');
  const policySection = sectionRow('정책 & 민생', 'POLICY · 정책 리포트', CATS[788367641], policyPosts, 'https://aibizinsider.com/category/%ec%a0%95%ec%b1%85-%eb%af%bc%ec%83%9d/');

  // Marquee (카테고리 태그 흐름)
  const marqueeItems = [
    'OpenAI · $122B Funding', 'Anthropic · Claude 4.6', 'Google · Gemma 4',
    'Cursor · Agent-First IDE', '정부 정책 2026', 'Meta · 7.5GW 인프라',
    '청년 월세 지원', 'AI Regulation G7',
  ];
  const marqueeHtml = [...marqueeItems, ...marqueeItems].map(t =>
    `<span style="display:inline-flex;align-items:center;padding:8px 18px;margin:0 6px;background:#f1f5f9;border-radius:100px;font-size:13px;font-weight:500;color:#475569;white-space:nowrap;letter-spacing:0.01em;">${t}</span>`
  ).join('');
  const marquee = `
<section style="margin-bottom:72px;padding:32px 0;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;overflow:hidden;position:relative;">
  <div style="position:absolute;top:0;left:0;width:100px;height:100%;background:linear-gradient(90deg,#fff 0%,transparent 100%);z-index:2;"></div>
  <div style="position:absolute;top:0;right:0;width:100px;height:100%;background:linear-gradient(-90deg,#fff 0%,transparent 100%);z-index:2;"></div>
  <div style="font-size:10px;font-weight:700;letter-spacing:0.22em;color:#94a3b8;text-align:center;margin-bottom:18px;">COVERING · 다루는 주제</div>
  <div style="display:flex;white-space:nowrap;animation:abi-marquee 40s linear infinite;width:max-content;">
    ${marqueeHtml}
  </div>
</section>`;

  // Newsletter
  const newsletter = `
<section style="margin-bottom:56px;position:relative;background:linear-gradient(135deg,#0a0f1e 0%,#1a1b3a 50%,#1e1b4b 100%);background-size:200% 200%;animation:abi-gradient 20s ease infinite;border-radius:28px;padding:64px 48px;color:#fff;overflow:hidden;" class="abi-noise">
  <div class="abi-dotgrid" style="position:absolute;inset:0;opacity:0.4;"></div>
  <div style="position:absolute;top:-80px;right:-80px;width:300px;height:300px;background:radial-gradient(circle,rgba(251,191,36,0.18) 0%,transparent 65%);border-radius:50%;"></div>
  <div style="position:relative;max-width:700px;margin:0 auto;text-align:center;">
    <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(251,191,36,0.12);color:#fbbf24;font-size:11px;font-weight:700;letter-spacing:0.18em;padding:7px 18px;border-radius:100px;margin-bottom:22px;border:1px solid rgba(251,191,36,0.28);">
      <span style="width:6px;height:6px;background:#fbbf24;border-radius:50%;animation:abi-pulse-dot 2s ease-in-out infinite;"></span>
      NEWSLETTER · 주간 뉴스레터
    </div>
    <h2 class="abi-section-title" style="font-family:var(--abi-serif);font-size:38px;font-weight:700;margin:0 0 18px 0;line-height:1.25;letter-spacing:-0.015em;word-break:keep-all;">월요일 아침, <span style="color:#fbbf24;font-weight:800;">5분 리딩</span>.</h2>
    <p style="font-size:16px;line-height:1.75;color:#cbd5e1;margin:0 0 32px 0;">한 주의 AI 산업, 정책, 투자 동향을 편집자가 골라 요약합니다. 광고 없음. 언제든 구독 취소 가능.</p>
    <a href="https://aibizinsider.com/?subscribe=invited" class="abi-shimmer-btn" style="display:inline-flex;align-items:center;gap:10px;background:#fbbf24;color:#0a1628;padding:14px 32px;border-radius:100px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.02em;box-shadow:0 8px 30px rgba(251,191,36,0.25);">무료로 받아보기 <span style="font-size:17px;">↗</span></a>
    <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-top:28px;font-size:12px;color:#64748b;letter-spacing:0.05em;">
      <span>광고 없음</span>
      <span style="opacity:0.4;">·</span>
      <span>언제든 취소</span>
      <span style="opacity:0.4;">·</span>
      <span>한 달 4편 발송</span>
    </div>
  </div>
</section>`;

  // About footer
  const about = `
<section style="margin-bottom:32px;padding:40px 36px;background:#f8fafc;border-radius:20px;border:1px solid #e2e8f0;">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:32px;">
    <div>
      <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#64748b;margin-bottom:10px;">ABOUT</div>
      <h3 style="font-family:var(--abi-serif);font-size:20px;font-weight:700;color:#0f172a;margin:0 0 10px 0;letter-spacing:-0.01em;">AI Biz Insider</h3>
      <p style="font-size:14px;color:#475569;margin:0;line-height:1.75;">한·영 이중 언어로 AI 산업과 정책을 다루는 독립 미디어. 원문 검증과 편집자 큐레이션이 핵심 원칙.</p>
    </div>
    <div>
      <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#64748b;margin-bottom:10px;">COVERAGE</div>
      <h3 style="font-family:var(--abi-serif);font-size:20px;font-weight:700;color:#0f172a;margin:0 0 10px 0;letter-spacing:-0.01em;">7 섹션 · ${totalPosts} 포스트</h3>
      <p style="font-size:14px;color:#475569;margin:0;line-height:1.75;">AI 비즈니스, 에이전트, 오픈소스, 정부 정책, 경제, 개발자 다이제스트까지 다층 커버리지.</p>
    </div>
    <div>
      <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#64748b;margin-bottom:10px;">STANDARDS</div>
      <h3 style="font-family:var(--abi-serif);font-size:20px;font-weight:700;color:#0f172a;margin:0 0 10px 0;letter-spacing:-0.01em;">원문 검증 · 출처 공개</h3>
      <p style="font-size:14px;color:#475569;margin:0;line-height:1.75;">모든 포스트 하단에 1차 소스 URL을 공개합니다. 추측 기반 주장은 싣지 않습니다.</p>
    </div>
  </div>
</section>`;

  return `<!-- wp:html -->
${styles}
<div class="abi-wrap" style="max-width:1200px;margin:0 auto;padding:0;color:#0f172a;">
${hero}
${categoryGrid}
${latestSection}
${marquee}
${bizSection}
${trendSection}
${enSection}
${policySection}
${newsletter}
${about}
</div>
<!-- /wp:html -->`;
}

// === 실행 ===
(async () => {
  console.log('[1/5] 카테고리 수집...');
  const catsRes = await apiCall('/categories/?fields=ID,name,slug,post_count&number=30');
  const catCounts = {};
  for (const c of (catsRes.categories || catsRes.found ? catsRes.categories : [])) {
    catCounts[c.ID] = c.post_count;
  }

  console.log('[2/5] 최신 포스트 수집...');
  const latestPosts = await fetchLatest(null, 5);

  console.log('[3/5] 카테고리별 포스트 수집...');
  const [kprBiz, kprTrend, enPosts, policyPosts] = await Promise.all([
    fetchLatest(CATS[778080398].slug, 4),
    fetchLatest(CATS[768858600].slug, 4),
    fetchLatest('ai-business-en,ai-trends-en', 4),
    fetchLatest('%ec%a0%95%ec%b1%85-%eb%af%bc%ec%83%9d,%ec%a0%95%eb%b6%80%ec%a0%95%ec%b1%85', 4),
  ]);

  // 총 포스트 수
  const totalPosts = Object.values(catCounts).reduce((a,b)=>a+b, 0);

  console.log('[4/5] HTML 생성...');
  const html = buildHTML({
    totalPosts: 111, // override — counts overlap across categories
    latestPosts, kprBiz, kprTrend, enPosts, policyPosts, catCounts
  });

  if (OUTPUT_FILE) {
    require('fs').writeFileSync(OUTPUT_FILE, html, 'utf8');
    console.log(`  → ${OUTPUT_FILE} 저장 (${Math.round(html.length/1024)}KB)`);
  }

  if (DRY_RUN) {
    console.log('[5/5] DRY-RUN 종료. 업로드 없음.');
    console.log(`HTML 길이: ${html.length} chars`);
    return;
  }

  console.log('[5/5] Page 2 업데이트...');
  const result = await apiCall('/posts/2', 'POST', { content: html });
  console.log(`  ✓ 완료. URL: ${result.URL || result.link}`);
  console.log(`  Modified: ${result.modified}`);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
