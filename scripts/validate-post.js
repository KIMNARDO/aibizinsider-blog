/**
 * 포스트 업로드 전 검증 스크립트
 *
 * co-work는 publish 호출 전에 반드시 이 스크립트로 콘텐츠를 검증해야 합니다.
 * 하나라도 실패하면 publish가 아닌 draft로 업로드할 것.
 *
 * 사용법 (Node):
 *   const { validatePost } = require('./validate-post');
 *   const result = validatePost({ content, categoryId, slug, featuredMediaId });
 *   if (!result.pass) { console.error(result.issues); // draft로 업로드 }
 *
 * CLI 사용:
 *   node validate-post.js --file=my-post.html --category=778080398 --slug=my-post-slug
 */

const CATEGORY_SPEC = {
  778080398: { name: 'AI 비즈니스', accent: '#f59e0b', darkBg: '#0a1628', label: 'TL;DR' },
  768858600: { name: 'AI 트렌드', accent: '#8b5cf6', darkBg: '#1e1b4b', label: 'TL;DR' },
  788391959: { name: 'AI Business (EN)', accent: '#10b981', darkBg: '#022c22', label: 'KEY TAKEAWAYS' },
  788391957: { name: 'AI Trends (EN)', accent: '#06b6d4', darkBg: '#0c4a6e', label: 'KEY POINTS' },
  788391976: { name: 'Tech Digest', accent: '#22c55e', darkBg: '#052e16', label: 'DIGEST' },
  788367641: { name: '정책 & 민생', accent: '#ef4444', darkBg: '#450a0a', label: '핵심 정리' },
  33592631:  { name: '정부정책', accent: '#ef4444', darkBg: '#450a0a', label: '핵심 정리' },
  100532:    { name: '경제', accent: '#f97316', darkBg: '#431407', label: '핵심 정리' },
};

// 이모지 감지용 (UTF 범위)
const EMOJI_RE = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F000}-\u{1F2FF}]|🔥|🏛|📌|✅|❌|⚡|🎯|🚀|💡|⭐|🌟/u;

function validatePost({ content, categoryId, slug, featuredMediaId, title }) {
  const issues = [];
  const warnings = [];
  const spec = CATEGORY_SPEC[categoryId];

  if (!spec) {
    issues.push(`CATEGORY_INVALID: category ${categoryId}는 허용된 7개 카테고리가 아님`);
    return { pass: false, issues, warnings };
  }

  // 1. wp:html 래퍼
  if (!/<!--\s*wp:html\s*-->/.test(content)) {
    issues.push('WRAPPER_MISSING: <!-- wp:html --> 래퍼 없음');
  }

  // 2. TL;DR 박스 존재
  const tldrLabels = ['TL;DR', 'KEY TAKEAWAYS', 'KEY POINTS', 'DIGEST', '핵심 정리'];
  const hasTldr = tldrLabels.some(l => content.includes(l));
  if (!hasTldr) {
    issues.push(`TLDR_MISSING: "${spec.label}" 박스 없음`);
  }

  // 3. 카테고리 ACCENT 색상 사용
  if (!content.toLowerCase().includes(spec.accent.toLowerCase())) {
    issues.push(`COLOR_MISMATCH: 카테고리 색상 ${spec.accent}가 본문에 없음`);
  }

  // 4. H2 border-bottom 스타일
  const h2Regex = new RegExp(`<h2[^>]*border-bottom[^>]*${spec.accent.replace('#','#')}`, 'i');
  if (!h2Regex.test(content)) {
    warnings.push(`H2_STYLE: H2에 border-bottom ${spec.accent} 패턴 감지 안됨`);
  }

  // 5. 관련 글 섹션
  const relatedLabels = ['관련 글', 'Related', '관련 정책', '관련 기사'];
  const hasRelated = relatedLabels.some(l => content.includes(l));
  if (!hasRelated) {
    issues.push('RELATED_MISSING: 관련 글 섹션 없음');
  }

  // 5-1. 관련 글 섹션 내 링크 개수
  if (hasRelated) {
    const relatedMatch = content.match(new RegExp(
      `(관련\\s*글|Related|관련\\s*정책|관련\\s*기사)[\\s\\S]*?(<ul[\\s\\S]*?<\\/ul>|<ol[\\s\\S]*?<\\/ol>)`, 'i'));
    if (relatedMatch) {
      const linkCount = (relatedMatch[2].match(/<a\s+href=/gi) || []).length;
      if (linkCount < 4) {
        issues.push(`RELATED_TOO_FEW: 관련 글 ${linkCount}개 (최소 4개 필요)`);
      }
    }
  }

  // 6. 출처 섹션
  const sourceLabels = ['출처', 'Sources', 'References'];
  const hasSources = sourceLabels.some(l => content.includes(l));
  if (!hasSources) {
    issues.push('SOURCES_MISSING: 출처/Sources 섹션 없음');
  }

  // 7. 외부 출처 URL 2개 이상
  const externalUrls = (content.match(/href="https?:\/\/(?!aibizinsider\.com)[^"]+"/g) || []);
  if (externalUrls.length < 2) {
    issues.push(`EXTERNAL_URLS_TOO_FEW: 외부 URL ${externalUrls.length}개 (최소 2개 필요)`);
  }

  // 8. 푸터 존재
  if (!/aibizinsider\.com/.test(content)) {
    issues.push('FOOTER_MISSING: 푸터에 aibizinsider.com 없음');
  }

  // 9. 이모지 검사
  if (EMOJI_RE.test(content)) {
    const match = content.match(EMOJI_RE);
    issues.push(`EMOJI_FOUND: 이모지 "${match[0]}" 발견 (규칙 위반)`);
  }
  if (title && EMOJI_RE.test(title)) {
    issues.push(`EMOJI_IN_TITLE: 제목에 이모지 있음`);
  }

  // 10. Slug 검사
  if (slug) {
    if (/%[0-9a-f]{2}/i.test(slug)) {
      issues.push(`SLUG_ENCODED: 한글 URL 인코딩 슬러그 "${slug.slice(0,40)}..." (영문 kebab-case만 허용)`);
    }
    if (slug.length > 60) {
      warnings.push(`SLUG_TOO_LONG: 슬러그 ${slug.length}자 (60자 이하 권장)`);
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      issues.push(`SLUG_INVALID_CHARS: 슬러그에 영문 소문자/숫자/하이픈 외 문자 포함`);
    }
  }

  // 11. Featured image
  if (!featuredMediaId) {
    issues.push(`FEATURED_IMAGE_MISSING: featured_media ID 없음 (대표이미지 필수)`);
  }

  // 12. 본문 길이
  if (content.length < 1500) {
    warnings.push(`CONTENT_TOO_SHORT: 본문 ${content.length}자 (1500자 이상 권장)`);
  }

  // 13. Tags (태그)
  // arguments.tags는 호출 측에서 전달, 문자열 또는 배열
  if (arguments[0].tags !== undefined) {
    const tagsList = typeof arguments[0].tags === 'string'
      ? arguments[0].tags.split(',').map(t => t.trim()).filter(Boolean)
      : (Array.isArray(arguments[0].tags) ? arguments[0].tags : []);
    if (tagsList.length < 3) {
      issues.push(`TAGS_TOO_FEW: 태그 ${tagsList.length}개 (최소 3개 필요)`);
    }
    if (tagsList.length > 7) {
      warnings.push(`TAGS_TOO_MANY: 태그 ${tagsList.length}개 (최대 7개 권장)`);
    }
    const bannedTags = ['AI', 'AI뉴스', 'AI업데이트', 'news', 'update', '뉴스', '업데이트'];
    const foundBanned = tagsList.filter(t => bannedTags.includes(t));
    if (foundBanned.length) {
      warnings.push(`TAGS_TOO_GENERIC: 일반적 태그 "${foundBanned.join(', ')}" (구체적으로 변경 권장)`);
    }
  }

  return {
    pass: issues.length === 0,
    issues,
    warnings,
    summary: `${issues.length}개 오류, ${warnings.length}개 경고`
  };
}

// CLI 모드
if (require.main === module) {
  const fs = require('fs');
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const a = args.find(x => x.startsWith(`--${name}=`));
    return a ? a.split('=')[1] : null;
  };
  const file = getArg('file');
  const categoryId = parseInt(getArg('category'));
  const slug = getArg('slug');
  const featuredMediaId = parseInt(getArg('featured')) || null;

  if (!file) {
    console.error('사용법: node validate-post.js --file=post.html --category=778080398 --slug=my-slug --featured=637');
    process.exit(1);
  }

  const content = fs.readFileSync(file, 'utf8');
  const result = validatePost({ content, categoryId, slug, featuredMediaId });

  console.log('=== 검증 결과 ===');
  console.log('상태:', result.pass ? '✓ PASS' : '✗ FAIL');
  console.log(result.summary);
  if (result.issues.length) {
    console.log('\n오류:');
    result.issues.forEach(i => console.log('  ✗', i));
  }
  if (result.warnings.length) {
    console.log('\n경고:');
    result.warnings.forEach(w => console.log('  ⚠', w));
  }
  process.exit(result.pass ? 0 : 1);
}

module.exports = { validatePost, CATEGORY_SPEC };
