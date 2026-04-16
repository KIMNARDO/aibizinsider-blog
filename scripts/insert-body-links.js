/**
 * aibizinsider.com - 본문 내 자연스러운 내부 링크 삽입 스크립트
 *
 * 각 포스트의 본문(<p> 단락)에서 다른 포스트 제목의 핵심 키워드를
 * 감지해 첫 등장 시 자연스러운 내부 링크로 변환합니다.
 *
 * 사용법:
 *   set WPCOM_TOKEN=your_token
 *   node insert-body-links.js --dry-run --limit=5
 *   node insert-body-links.js
 */

const https = require('https');

const TOKEN = process.env.WPCOM_TOKEN;
const SITE = 'aibizinsider.com';
const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT_ARG = process.argv.find(a => a.startsWith('--limit'));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1]) : Infinity;
const MAX_LINKS_PER_POST = 3; // 한 포스트당 본문에 추가할 최대 링크 수

if (!TOKEN) { console.error('WPCOM_TOKEN 환경변수 필요'); process.exit(1); }

function apiCall(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'public-api.wordpress.com',
      path: `/rest/v1.1/sites/${SITE}${path}`,
      method,
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
        } else reject(new Error(`${res.statusCode}: ${data.slice(0, 200)}`));
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function listAllPosts() {
  const posts = [];
  let page = 1;
  while (true) {
    const res = await apiCall(`/posts/?number=100&page=${page}&status=publish&fields=ID,title,URL,categories,date`);
    if (!res.posts || res.posts.length === 0) break;
    posts.push(...res.posts);
    if (res.posts.length < 100) break;
    page++;
  }
  return posts;
}

async function getPost(id) {
  return await apiCall(`/posts/${id}/?fields=ID,title,URL,content`);
}

async function updatePost(id, content) {
  return await apiCall(`/posts/${id}/`, 'POST', { content });
}

/**
 * 포스트 제목에서 키워드(명사구) 추출.
 * 우선순위: 명확한 고유명사 (회사명, 제품명, 정책명, 달러 수치)
 */
function extractKeywords(title) {
  const cleanTitle = title.replace(/&#8217;/g, "'").replace(/&amp;/g, '&').replace(/[—:,—\[\]]/g, ' ');

  const keywords = new Set();

  // 패턴 1: 대문자 시작 2~4단어 고유명사 연쇄 (영문)
  const enPatterns = cleanTitle.match(/\b[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z0-9]*){0,3}\b/g) || [];
  for (const p of enPatterns) {
    if (p.length >= 5 && p.length <= 40) keywords.add(p);
  }

  // 패턴 2: 한글 고유명사 (2~8자, 특수 용어)
  const koPatterns = cleanTitle.match(/[가-힣A-Za-z0-9]{3,15}(?=\s|[,·—:\.]|$)/g) || [];
  for (const p of koPatterns) {
    // 한글이 포함되면 추가
    if (/[가-힣]/.test(p) && p.length >= 4 && p.length <= 20) keywords.add(p);
  }

  // 패턴 3: 달러/숫자 수치 ($NB, 조원 등)
  const numPatterns = cleanTitle.match(/\$\d+(?:\.\d+)?[BMTK]?|\d+조\s*원|\d+억\s*원|\d+\s*GW/g) || [];
  for (const p of numPatterns) keywords.add(p);

  // 너무 일반적인 단어 필터링
  const stopwords = new Set([
    'AI', 'April', 'March', 'Update', 'Today', 'Tonight', 'Industry', 'News',
    '분석', '공개', '완전', '정리', '가이드', '전략', '정책', '시대',
    'Analysis', 'Report', 'Guide', 'Weekly', 'Daily', 'Evening', 'Morning',
    '2026', '2025', '한국', '기업', '발표'
  ]);
  return [...keywords].filter(k => !stopwords.has(k));
}

/**
 * HTML 안전 문자열 치환 — 태그 안이나 기존 <a> 안은 건드리지 않음
 */
function safeReplaceFirst(html, keyword, url, linkColor) {
  // HTML을 텍스트 노드와 태그로 분할
  const tokens = html.split(/(<[^>]+>)/g);
  const keywordRegex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\$]/g, '\\$&')}\\b`, 'i');

  let inAnchor = 0;
  let inHeading = 0;
  let replaced = false;

  for (let i = 0; i < tokens.length && !replaced; i++) {
    const t = tokens[i];
    if (t.startsWith('<')) {
      // 태그 추적
      if (/^<a\b/i.test(t)) inAnchor++;
      else if (/^<\/a>/i.test(t)) inAnchor = Math.max(0, inAnchor - 1);
      if (/^<h[1-6]\b/i.test(t)) inHeading++;
      else if (/^<\/h[1-6]>/i.test(t)) inHeading = Math.max(0, inHeading - 1);
      continue;
    }
    if (inAnchor > 0 || inHeading > 0) continue; // 기존 링크·헤딩 내부는 스킵

    const match = t.match(keywordRegex);
    if (match) {
      const idx = match.index;
      const matched = match[0];
      const before = t.slice(0, idx);
      const after = t.slice(idx + matched.length);
      tokens[i] = before +
        `<a href="${url}" style="color:${linkColor};text-decoration:underline;text-decoration-style:dotted;">${matched}</a>` +
        after;
      replaced = true;
    }
  }
  return { html: tokens.join(''), replaced };
}

// 카테고리별 링크 색상
const LINK_COLORS = {
  788391959: '#10b981', // AI_BIZ_EN
  788391957: '#06b6d4', // AI_TREND_EN
  788391976: '#22c55e', // TECH_DIGEST
  778080398: '#f59e0b', // AI_BIZ_KR
  768858600: '#8b5cf6', // AI_TREND_KR
  33592631:  '#ef4444', // POLICY
  788367641: '#ef4444', // POLICY
  100532:    '#f97316', // ECON
  253219399: '#f97316', // ECON
};
function getLinkColor(post) {
  for (const cn of Object.keys(post.categories || {})) {
    const id = post.categories[cn].ID;
    if (LINK_COLORS[id]) return LINK_COLORS[id];
  }
  return '#0369a1'; // 기본
}

(async () => {
  console.log('[1/3] 포스트 목록 및 키워드 인덱스 구축...');
  const allPosts = await listAllPosts();

  // 키워드 → URL Map
  const keywordToUrl = new Map(); // keyword.toLowerCase() -> { url, title, postId }
  for (const p of allPosts) {
    const kws = extractKeywords(p.title);
    for (const kw of kws) {
      const key = kw.toLowerCase();
      // 긴 키워드 우선 (첫 등록 우선, 덮어쓰기 방지)
      if (!keywordToUrl.has(key)) {
        keywordToUrl.set(key, { url: p.URL, title: p.title, postId: p.ID, keyword: kw });
      }
    }
  }
  console.log(`  → ${allPosts.length}개 포스트 / ${keywordToUrl.size}개 고유 키워드 인덱스`);

  const targets = allPosts.slice(0, LIMIT);
  console.log(`[2/3] 처리 대상: ${targets.length}개`);
  if (DRY_RUN) console.log('  ※ DRY-RUN 모드');

  let stats = { scanned: 0, modified: 0, noMatch: 0, failed: 0, totalLinksAdded: 0 };
  console.log('[3/3] 처리 시작...');

  // 긴 키워드 우선 매칭 위해 내림차순 정렬
  const sortedKeywords = [...keywordToUrl.entries()].sort((a, b) => b[0].length - a[0].length);

  for (const p of targets) {
    stats.scanned++;
    try {
      const post = await getPost(p.ID);
      let content = post.content;
      if (!content) { stats.noMatch++; continue; }

      const linkColor = getLinkColor(p);
      let addedCount = 0;
      const addedUrls = new Set();
      const usedKeywords = new Set(); // 같은 키워드 중복 방지

      for (const [kwLower, info] of sortedKeywords) {
        if (addedCount >= MAX_LINKS_PER_POST) break;
        if (info.postId === p.ID) continue; // 자기 자신 제외
        if (usedKeywords.has(kwLower)) continue;
        if (addedUrls.has(info.url)) continue; // 같은 URL 중복 방지

        // 본문에 이미 해당 URL이 링크로 있으면 스킵 (이미 연결됨)
        if (content.includes(`href="${info.url}"`)) { usedKeywords.add(kwLower); continue; }

        const result = safeReplaceFirst(content, info.keyword, info.url, linkColor);
        if (result.replaced) {
          content = result.html;
          addedCount++;
          addedUrls.add(info.url);
          usedKeywords.add(kwLower);
        }
      }

      if (addedCount > 0) {
        if (!DRY_RUN) {
          await updatePost(p.ID, content);
        }
        stats.modified++;
        stats.totalLinksAdded += addedCount;
        console.log(`  [${p.ID}] +${addedCount} 본문 링크${DRY_RUN ? ' (dry-run)' : ' ✓'}`);
      } else {
        stats.noMatch++;
        // 조용히 스킵 (출력 생략)
      }
    } catch (e) {
      stats.failed++;
      console.log(`  [${p.ID}] 실패: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n=== 완료 ===');
  console.log(`  스캔:              ${stats.scanned}`);
  console.log(`  수정:              ${stats.modified}`);
  console.log(`  매칭 없음:         ${stats.noMatch}`);
  console.log(`  실패:              ${stats.failed}`);
  console.log(`  추가된 링크 총계:  ${stats.totalLinksAdded}`);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
