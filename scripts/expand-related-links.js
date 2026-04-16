/**
 * aibizinsider.com - 관련 글 섹션 확대 스크립트
 *
 * 각 포스트의 "관련 글" / "Related" / "관련 정책" 섹션의 링크를
 * 2~3개에서 4~5개로 확장합니다.
 *
 * 사용법:
 *   1. WordPress.com Personal Access Token 발급
 *      https://developer.wordpress.com/apps/ -> Create New Application
 *      -> Get token (scope: global)
 *   2. 환경변수 설정: SET WPCOM_TOKEN=your_token
 *   3. 실행: node expand-related-links.js
 *
 * 옵션:
 *   --dry-run : 실제 업데이트 없이 변경사항만 출력
 *   --limit N : 최대 N개 포스트만 처리 (테스트용)
 */

const https = require('https');

const TOKEN = process.env.WPCOM_TOKEN;
const SITE = 'aibizinsider.com';
const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT_ARG = process.argv.find(a => a.startsWith('--limit'));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1] || process.argv[process.argv.indexOf(LIMIT_ARG) + 1]) : Infinity;

if (!TOKEN) {
  console.error('ERROR: WPCOM_TOKEN environment variable is required');
  console.error('Get token from: https://developer.wordpress.com/apps/');
  process.exit(1);
}

// 카테고리별 색상 (color-system.json 요약)
const CATEGORY_COLORS = {
  788391959: { name: 'AI_BIZ_EN', color: '#10b981', label: 'Related' },
  788391957: { name: 'AI_TREND_EN', color: '#06b6d4', label: 'Related' },
  788391976: { name: 'TECH_DIGEST', color: '#22c55e', label: '관련 글' },
  778080398: { name: 'AI_BIZ_KR', color: '#f59e0b', label: '관련 글' },
  768858600: { name: 'AI_TREND_KR', color: '#8b5cf6', label: '관련 글' },
  33592631:  { name: 'POLICY', color: '#ef4444', label: '관련 정책' },
  788367641: { name: 'POLICY', color: '#ef4444', label: '관련 정책' },
  100532:    { name: 'ECON', color: '#f97316', label: '관련 기사' },
  253219399: { name: 'ECON', color: '#f97316', label: '관련 기사' },
};

function apiCall(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'public-api.wordpress.com',
      path: `/rest/v1.1/sites/${SITE}${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
        } else {
          reject(new Error(`${res.statusCode}: ${data.slice(0, 200)}`));
        }
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
  return await apiCall(`/posts/${id}/?fields=ID,title,URL,categories,content,date`);
}

async function updatePost(id, content) {
  return await apiCall(`/posts/${id}/`, 'POST', { content });
}

// 카테고리 식별
function getPrimaryCategory(post) {
  const cats = Object.keys(post.categories || {});
  for (const catName of cats) {
    const catId = post.categories[catName].ID;
    if (CATEGORY_COLORS[catId]) return { id: catId, ...CATEGORY_COLORS[catId] };
  }
  return null;
}

// 제목 키워드 유사도 (간단 Jaccard)
function similarity(a, b) {
  const ta = new Set((a || '').toLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
  const tb = new Set((b || '').toLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
  const inter = [...ta].filter(x => tb.has(x)).length;
  const uni = new Set([...ta, ...tb]).size;
  return uni === 0 ? 0 : inter / uni;
}

// 관련 글 후보 선정
function findCandidates(post, allPosts, maxCount = 5) {
  const cat = getPrimaryCategory(post);
  if (!cat) return [];
  const postDate = new Date(post.date);
  return allPosts
    .filter(p => p.ID !== post.ID)
    .filter(p => {
      const pCat = getPrimaryCategory(p);
      return pCat && pCat.name === cat.name;
    })
    .map(p => {
      const dateDiff = Math.abs(new Date(p.date) - postDate) / 86400000; // days
      const sim = similarity(post.title, p.title);
      const score = sim * 2 - dateDiff * 0.01; // 키워드 가중, 날짜 감쇠
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount);
}

// 현재 관련 글 섹션 파싱 및 확장
function expandRelatedSection(content, candidates, category) {
  const label = category.label;
  const color = category.color;

  // "관련 글" / "Related" / "관련 정책" / "관련 기사" 섹션 찾기
  // 패턴: <h2 ...>LABEL</h2> 뒤에 오는 <ul>...</ul>
  const labels = ['관련 글', 'Related', '관련 정책', '관련 기사', '관련'];
  const labelPattern = labels.map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

  // <h2> 뒤에 선택적으로 <div> 래퍼, 그 안에 <ul>
  const h2Regex = new RegExp(
    `(<h2[^>]*>\\s*(?:${labelPattern})\\s*<\\/h2>\\s*(?:<div[^>]*>\\s*)?)(<ul[^>]*>)([\\s\\S]*?)(<\\/ul>)`,
    'i'
  );

  const match = content.match(h2Regex);
  if (!match) {
    return { changed: false, reason: 'no_related_section', content };
  }

  // 현재 링크 개수 파싱
  const existingLinks = match[3].match(/<a[^>]*href=/gi) || [];
  if (existingLinks.length >= 4) {
    return { changed: false, reason: 'already_has_4_plus', content };
  }

  // 기존 href URL 목록 수집 (중복 방지)
  const existingHrefs = new Set();
  const hrefMatches = match[3].matchAll(/href="([^"]+)"/gi);
  for (const h of hrefMatches) existingHrefs.add(h[1].replace(/\/$/, ''));

  // 후보에서 기존 것 제외하고 필요한 만큼 추가
  const needCount = 5 - existingLinks.length;
  const addCandidates = candidates
    .filter(c => !existingHrefs.has(c.URL.replace(/\/$/, '')))
    .slice(0, needCount);

  if (addCandidates.length === 0) {
    return { changed: false, reason: 'no_new_candidates', content };
  }

  // 기존 <li> 스타일 추출해 재사용 (일관성)
  const sampleLi = match[3].match(/<li[^>]*>[\s\S]*?<\/li>/i);
  let liStyleTemplate = null;
  if (sampleLi) {
    // 첫 <li>에서 style 추출
    const liStyle = sampleLi[0].match(/<li(\s+style="[^"]*")?/i);
    const aTag = sampleLi[0].match(/<a[^>]*style="([^"]*)"[^>]*>/i);
    liStyleTemplate = {
      liAttrs: liStyle && liStyle[1] ? liStyle[1] : '',
      aStyle: aTag && aTag[1] ? aTag[1] : `color:${color};text-decoration:none;font-weight:600`,
      hasTargetBlank: /target="_blank"/.test(sampleLi[0]),
      hasRel: /rel="[^"]*"/.test(sampleLi[0]),
    };
  }

  // 새 <li> 추가 (기존 스타일 맞춤)
  const newItems = addCandidates.map(c => {
    const title = (c.title || '').replace(/<[^>]+>/g, '').replace(/&#8217;/g, "'").replace(/&amp;/g, '&');
    if (liStyleTemplate) {
      const targetAttr = liStyleTemplate.hasTargetBlank ? ' target="_blank"' : '';
      const relAttr = liStyleTemplate.hasRel ? ' rel="noopener noreferrer"' : '';
      return `<li${liStyleTemplate.liAttrs}><a href="${c.URL}"${targetAttr}${relAttr} style="${liStyleTemplate.aStyle}">${title}</a></li>`;
    }
    return `<li><a href="${c.URL}" style="color:${color};text-decoration:none;font-weight:600">${title}</a></li>`;
  }).join('\n');

  // 기존 </ul> 직전에 삽입
  const newUl = match[3] + '\n' + newItems + '\n';
  const newSection = match[1] + match[2] + newUl + match[4];
  const newContent = content.replace(h2Regex, newSection);

  return {
    changed: true,
    addedCount: addCandidates.length,
    addedUrls: addCandidates.map(c => c.URL),
    content: newContent
  };
}

// 메인
(async () => {
  console.log('[1/3] 포스트 목록 수집 중...');
  const allPosts = await listAllPosts();
  console.log(`  → ${allPosts.length}개 포스트 수집 완료`);

  const targetPosts = allPosts.filter(p => getPrimaryCategory(p)).slice(0, LIMIT);
  console.log(`[2/3] 처리 대상: ${targetPosts.length}개 (카테고리 있는 포스트)`);
  if (DRY_RUN) console.log('  ※ DRY-RUN 모드: 실제 업데이트 없음');

  let stats = { scanned: 0, expanded: 0, skipped_already4: 0, skipped_nosection: 0, skipped_nocand: 0, failed: 0 };

  console.log(`[3/3] 처리 시작...`);
  for (const p of targetPosts) {
    stats.scanned++;
    try {
      const post = await getPost(p.ID);
      const category = getPrimaryCategory(post);
      const candidates = findCandidates(post, allPosts, 8);
      const result = expandRelatedSection(post.content, candidates, category);

      if (!result.changed) {
        if (result.reason === 'already_has_4_plus') stats.skipped_already4++;
        else if (result.reason === 'no_related_section') stats.skipped_nosection++;
        else if (result.reason === 'no_new_candidates') stats.skipped_nocand++;
        console.log(`  [${p.ID}] 스킵 (${result.reason})`);
        continue;
      }

      if (!DRY_RUN) {
        await updatePost(p.ID, result.content);
      }
      stats.expanded++;
      console.log(`  [${p.ID}] ${category.name} +${result.addedCount} 링크 추가${DRY_RUN ? ' (dry-run)' : ' ✓'}`);
    } catch (e) {
      stats.failed++;
      console.log(`  [${p.ID}] 실패: ${e.message}`);
    }
    // API rate limit 방지
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n=== 완료 ===');
  console.log(`  스캔:         ${stats.scanned}`);
  console.log(`  확장 완료:    ${stats.expanded}`);
  console.log(`  기존 4+ 스킵: ${stats.skipped_already4}`);
  console.log(`  섹션 없음:    ${stats.skipped_nosection}`);
  console.log(`  후보 없음:    ${stats.skipped_nocand}`);
  console.log(`  실패:         ${stats.failed}`);
})().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
