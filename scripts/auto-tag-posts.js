/**
 * aibizinsider.com - 과거 포스트 태그 자동 보강
 *
 * 각 포스트의 title + excerpt + content를 분석해
 * Tier 1 (구체 엔티티) + Tier 2 (분류) 태그를 자동 추출·설정합니다.
 *
 * 사용법:
 *   set WPCOM_TOKEN=...
 *   node auto-tag-posts.js --dry-run            # 변경 내용만 출력
 *   node auto-tag-posts.js                      # 실제 적용
 *   node auto-tag-posts.js --overwrite          # 기존 태그 무시하고 덮어쓰기
 *   node auto-tag-posts.js --limit=5            # 테스트용 소수만
 */

const https = require('https');

const TOKEN = process.env.WPCOM_TOKEN;
const SITE = 'aibizinsider.com';
const DRY_RUN = process.argv.includes('--dry-run');
const OVERWRITE = process.argv.includes('--overwrite');
const LIMIT_ARG = process.argv.find(a => a.startsWith('--limit'));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1]) : Infinity;

if (!TOKEN) { console.error('WPCOM_TOKEN 필요'); process.exit(1); }

function api(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'public-api.wordpress.com',
      path: `/rest/v1.1/sites/${SITE}${path}`,
      method,
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
        } else reject(new Error(`${res.statusCode}: ${data.slice(0,200)}`));
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ============ 엔티티 사전 (Tier 1 — 구체 태그) ============
const ENTITIES = {
  // AI 기업
  companies: [
    'OpenAI', 'Anthropic', 'Google', 'Meta', 'Microsoft', 'Apple', 'NVIDIA',
    'Amazon', 'AWS', 'Azure', 'Alibaba', 'Qwen', 'Mistral', 'Cohere',
    'Naver', 'Kakao', 'LG AI', 'SKT', 'Samsung', 'Hyundai',
    'CoreWeave', 'Vercel', 'Cloudflare', 'GitHub', 'GitLab', 'Atlassian',
    'Anthropic', 'DeepSeek', 'Perplexity', 'xAI',
  ],
  // 제품·기술
  products: [
    'ChatGPT', 'GPT-5', 'GPT-4', 'Claude Code', 'Claude Sonnet', 'Claude Opus',
    'Claude Haiku', 'Gemini', 'Gemma', 'Llama', 'HyperClova', 'Copilot',
    'Cursor', 'MCP', 'RAG', 'Agent Skills', 'Ultraplan', 'Mythos',
    'Bedrock', 'Vertex AI', 'Copilot Enterprise',
    'Veo', 'Sora', 'DALL-E', 'Midjourney', 'Stable Diffusion',
  ],
  // 한국 정책·용어
  policies: [
    'AI 기본법', '청년월세지원', '고유가 지원금', '육아휴직', '단기 육아휴직',
    '에이전틱 AI', '인공지능행동계획', 'AI 3강', 'G7 AI 규제',
    '피지컬 AI', '데이터 스페이스', 'K-ISMS', '산업기술보호법',
    'AI 경진대회', '반값 여행', '건강보험료', '기름값',
  ],
  // 비즈니스 용어
  business: [
    '밸류에이션', 'IPO', '인수', 'M&A', '펀딩', '투자', '상장',
    '스타트업', '엔터프라이즈', '클라우드', '온프레미스', '보안',
    '공급망', 'DLP', '컴플라이언스', '규제',
  ],
  // 제조·PLM 특화
  manufacturing: [
    'PLM', 'MES', 'WMS', 'CAD', 'BOM', '설계 변경', 'ECO', 'ECN',
    '스마트공장', '제조업', '반도체', '자동차', '의료기기',
    '공정', '품질관리', '휴먼 에러',
  ],
};

// 정규식 기반 추가 감지
const REGEX_PATTERNS = [
  { re: /\$(\d+(?:\.\d+)?)\s*(B|M|T|억|조)/gi, tag: (m) => `$${m[1]}${m[2]}` },
  { re: /(\d+(?:,\d+)*)\s*(조|억)\s*원/g, tag: (m) => `${m[1]}${m[2]}원` },
  { re: /(GPT|Claude|Gemma|Llama|Qwen|Mistral|Gemini)[\s-]*(\d+(?:\.\d+)?)/gi, tag: (m) => `${m[1]} ${m[2]}` },
];

// ============ 카테고리별 기본 태그 (Tier 2 — 분류) ============
const CATEGORY_DEFAULT_TAGS = {
  778080398: ['AI 비즈니스', 'AI 산업'],          // AI 비즈니스
  768858600: ['AI 트렌드', 'AI 개발 도구'],        // AI 트렌드
  788391959: ['AI Business', 'AI Industry'],        // AI Business EN
  788391957: ['AI Trends', 'Developer Tools'],      // AI Trends EN
  788391976: ['Tech Digest', '개발자 큐레이션'],    // Tech Digest
  33592631:  ['정부정책', '정책 가이드'],           // 정부정책
  788367641: ['정책 & 민생', '정부 지원금'],        // 정책 & 민생
  100532:    ['경제', '한국 경제'],                 // 경제
};

// 짧은 약어는 단어 경계 + 충분한 빈도 필요
const SHORT_ACRONYMS = new Set(['MCP','RAG','CAD','BOM','ECO','ECN','WMS','MES','PLM','DLP','GPT','LLM','API']);

// ============ 태그 추출 함수 ============
function extractTags(post) {
  // 제목 + 발췌(Excerpt)만 분석. 본문은 관련 글·출처 섹션의 용어를 잘못 잡아낼 수 있음.
  const title = post.title || '';
  const excerpt = (post.excerpt || '').replace(/<[^>]+>/g, '');
  const text = `${title} ${excerpt}`;
  const textLower = text.toLowerCase();
  const found = new Map(); // entity → score

  // 1. 엔티티 사전 매칭 (단어 경계 엄격)
  for (const [cat, list] of Object.entries(ENTITIES)) {
    for (const entity of list) {
      const lowerE = entity.toLowerCase();
      // 짧은 영문 약어(3~4자)는 단어 경계 필수
      if (SHORT_ACRONYMS.has(entity)) {
        const re = new RegExp(`\\b${entity}\\b`, 'i');
        if (re.test(text)) found.set(entity, (found.get(entity) || 0) + 2);
      } else if (lowerE.length <= 4 && /^[a-z]+$/.test(lowerE)) {
        // 기타 짧은 영문도 단어 경계
        const re = new RegExp(`\\b${entity}\\b`, 'i');
        if (re.test(text)) found.set(entity, (found.get(entity) || 0) + 1);
      } else {
        // 긴 단어·한글은 단순 포함
        if (textLower.includes(lowerE)) found.set(entity, (found.get(entity) || 0) + 1);
      }
    }
  }

  // 2. 정규식 패턴
  for (const { re, tag } of REGEX_PATTERNS) {
    const matches = text.matchAll(re);
    for (const m of matches) {
      const t = tag(m).trim();
      if (t.length >= 2 && t.length <= 25) found.set(t, (found.get(t) || 0) + 1);
    }
  }

  // 3. 카테고리별 기본 태그 (Tier 2)
  const catIds = Object.keys(post.categories || {}).map(k => post.categories[k].ID);
  const defaultTags = [];
  for (const id of catIds) {
    if (CATEGORY_DEFAULT_TAGS[id]) defaultTags.push(...CATEGORY_DEFAULT_TAGS[id]);
  }

  // 4. 카테고리별 화이트리스트 제한 — 카테고리에 맞지 않는 태그 필터
  const CATEGORY_FILTER = {
    33592631:  { block: ['MCP','RAG','CAD','BOM','ECO','ECN','WMS','MES','PLM','DLP','LLM'] },
    788367641: { block: ['MCP','RAG','CAD','BOM','ECO','ECN','WMS','MES','PLM','DLP','LLM'] },
    100532:    { block: ['MCP','RAG','CAD','BOM','ECO','ECN','WMS','MES','PLM','DLP'] },
  };
  for (const id of catIds) {
    const filter = CATEGORY_FILTER[id];
    if (filter && filter.block) {
      for (const b of filter.block) found.delete(b);
    }
  }

  // 5. 점수순 정렬 후 Tier 1 최대 5개 + Tier 2 2개
  const tier1 = [...found.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k]) => k);
  const tier2 = [...new Set(defaultTags)].slice(0, 2);
  return [...new Set([...tier1, ...tier2])];
}

// ============ 메인 ============
async function listAllPosts() {
  const posts = [];
  let page = 1;
  while (true) {
    const res = await api(`/posts/?number=100&page=${page}&status=publish&fields=ID,title,excerpt,content,categories,tags,slug`);
    if (!res.posts || res.posts.length === 0) break;
    posts.push(...res.posts);
    if (res.posts.length < 100) break;
    page++;
  }
  return posts;
}

async function updatePostTags(id, tags) {
  return api(`/posts/${id}`, 'POST', { tags: tags.join(',') });
}

(async () => {
  console.log('[1/3] 포스트 수집...');
  const posts = await listAllPosts();
  console.log(`  → ${posts.length}개 포스트`);

  const targets = posts.slice(0, LIMIT);
  console.log(`[2/3] 처리 대상: ${targets.length}개${DRY_RUN ? ' (DRY-RUN)' : ''}${OVERWRITE ? ' (OVERWRITE)' : ''}`);

  const stats = { total: 0, updated: 0, skipped: 0, failed: 0, noTags: 0 };
  console.log('[3/3] 태그 추출 및 업데이트...');

  for (const p of targets) {
    stats.total++;
    const existingTags = Object.keys(p.tags || {});
    const newTags = extractTags(p);

    if (newTags.length === 0) {
      stats.noTags++;
      console.log(`  [${p.ID}] 태그 추출 실패 (스킵)`);
      continue;
    }

    // OVERWRITE 모드가 아니고 기존 태그가 충분하면 스킵
    if (!OVERWRITE && existingTags.length >= 3) {
      stats.skipped++;
      continue;
    }

    const finalTags = OVERWRITE ? newTags : [...new Set([...existingTags, ...newTags])].slice(0, 7);

    try {
      if (!DRY_RUN) {
        await updatePostTags(p.ID, finalTags);
      }
      stats.updated++;
      console.log(`  [${p.ID}] ${p.slug ? p.slug.slice(0,40) : ''}  →  ${finalTags.join(', ')}`);
    } catch (e) {
      stats.failed++;
      console.log(`  [${p.ID}] 실패: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 250));
  }

  console.log('\n=== 완료 ===');
  console.log(`  전체 대상:   ${stats.total}`);
  console.log(`  업데이트:    ${stats.updated}`);
  console.log(`  기존 유지:   ${stats.skipped}`);
  console.log(`  태그 없음:   ${stats.noTags}`);
  console.log(`  실패:        ${stats.failed}`);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
