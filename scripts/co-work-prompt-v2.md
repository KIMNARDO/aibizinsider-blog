# co-work 강제 준수 프롬프트 v2

## ⚠️ 문제 발생 기록 (2026-04-14)

co-work가 12개 포스트를 규칙 위반 상태로 업로드했고 전부 draft로 돌렸다. 원인:
- `wp:html` 래퍼 누락
- TL;DR/관련 글/카테고리 색상 전부 누락
- 이모지 사용, 한글 인코딩 슬러그, 카테고리 미분류 등

이번 프롬프트는 **절대 규칙**과 **강제 검증**을 구조화했다. 어기면 publish하지 말 것.

---

## 🚨 복사해서 co-work 세션에 붙여넣기 (전체)

```
너는 aibizinsider.com(WordPress.com Personal) 블로그에 포스트를 작성·업로드한다.
직전 세션에서 12개 포스트가 규칙 위반으로 전부 draft 처리됐다. 같은 실수를 반복하지 말 것.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 작업 시작 전 필수 읽기 (3개 파일)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. C:\00.AI개발\워드프레스블로그관리\CLAUDE.md  (운영 매뉴얼)
2. C:\00.AI개발\워드프레스블로그관리\templates\POST-TEMPLATE-MASTER.md  (포스트 템플릿)
3. C:\00.AI개발\워드프레스블로그관리\scripts\validate-post.js  (검증 스크립트)

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 작업 플로우 (반드시 이 순서)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 주제·카테고리 결정 → 카테고리 ID 확보
2. 외부 소스 2개 이상 WebFetch로 팩트 수집
3. POST-TEMPLATE-MASTER.md의 HTML 템플릿 복제
4. 카테고리 색상표에서 {{ACCENT}}, {{DARK_BG}}, {{GRAD1}}, {{GRAD2}}, {{LABEL}} 치환
5. 내용 채우기 (TL;DR 4줄, 섹션 3개 이상, 관련 글 4개, 출처 2개, 푸터)
6. **validate-post.js로 검증 (필수)**:
   node scripts/validate-post.js --file=<작성한_파일> --category=<ID> --slug=<slug> --featured=<media_id>
7. 검증 통과 시 status: 'publish', 실패 시 status: 'draft' + 이유 기록
8. 업로드 전 featured_media(대표이미지 ID) 반드시 포함

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 카테고리 ID · 색상 (외워둘 것)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
| ID | 이름 | ACCENT | DARK_BG | LABEL |
| 778080398 | AI 비즈니스 | #f59e0b | #0a1628 | TL;DR |
| 768858600 | AI 트렌드 | #8b5cf6 | #1e1b4b | TL;DR |
| 788391959 | AI Business EN | #10b981 | #022c22 | KEY TAKEAWAYS |
| 788391957 | AI Trends EN | #06b6d4 | #0c4a6e | KEY POINTS |
| 788391976 | Tech Digest | #22c55e | #052e16 | DIGEST |
| 788367641 | 정책 & 민생 | #ef4444 | #450a0a | 핵심 정리 |
| 33592631  | 정부정책 | #ef4444 | #450a0a | 핵심 정리 |
| 100532    | 경제 | #f97316 | #431407 | 핵심 정리 |

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 자동 draft 전환 트리거 (검증 스크립트가 감지)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
하나라도 해당하면 즉시 status: draft:
- wp:html 래퍼 누락
- TL;DR 박스 누락
- 카테고리 ACCENT 색상 본문에 없음
- 관련 글 섹션 없거나 4개 미만
- 외부 출처 URL 2개 미만
- 푸터 aibizinsider.com 없음
- 이모지(🔥🏛️🎯⚡ 등) 사용
- slug 한글 URL 인코딩(%ea%b3%a0...)
- slug에 영문소문자/숫자/하이픈 외 문자
- featured_media ID 없음
- 카테고리 미분류(ID 1) 또는 승인 외 카테고리

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 업로드 호출 형식 (예시)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
operation: posts.create
params: {
  title: "한국어/영문 제목 (이모지 없음)",
  content: "<!-- wp:html -->...전체 템플릿...<!-- /wp:html -->",
  slug: "english-kebab-case-slug-60chars-max",
  status: "publish",  // 검증 통과 시만. 실패 시 draft
  categories: [778080398],  // 숫자 배열, 미분류 금지
  featured_media: 637,  // 필수, 이미지 없으면 draft
  user_confirmed: "yes"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏷️ Tags (태그) 규칙 — 필수
━━━━━━━━━━━━━━━━━━━━━━━━━━━
모든 포스트는 tags 필드에 3~7개를 포함해야 한다. 없으면 draft로 강등된다.

구조 (2-tier):
- Tier 1 (구체 엔티티, 3~5개): 회사명·제품명·정책명·수치
  예: "OpenAI", "Claude Code", "AI 기본법", "청년월세지원", "$122B", "Gemma 4"
- Tier 2 (분류, 1~2개): 카테고리별 고정 태그
  AI 비즈니스(KR)  → "AI 비즈니스", "AI 산업"
  AI 트렌드(KR)    → "AI 트렌드", "AI 개발 도구"
  AI Business(EN)  → "AI Business", "AI Industry"
  AI Trends(EN)    → "AI Trends", "Developer Tools"
  Tech Digest      → "Tech Digest", "개발자 큐레이션"
  정책 & 민생      → "정책 & 민생", "정부 지원금"
  정부정책         → "정부정책", "정책 가이드"
  경제             → "경제", "한국 경제"

금지 태그 (일반적이고 검색 가치 낮음):
- "AI", "AI뉴스", "AI업데이트" (너무 broad, 롱테일 롤 못함)
- "news", "update" (의미 없음)

좋은 태그 예시 (Post 1018 월간 리포트):
  Tier 1: "제조업 AI", "CAD 검증", "온프레미스 LLM", "Llama 3.3", "HyperClova X"
  Tier 2: "AI 비즈니스", "AI 산업"

업로드 시 포함:
params: {
  ...
  tags: "Tier1태그1,Tier1태그2,Tier1태그3,Tier2태그1,Tier2태그2",
  ...
}
(쉼표로 구분된 문자열. 배열이 아닌 string 타입)

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 참고 포스트 (복제용)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
다음 포스트들의 content를 가져와 구조 복제:
- POLICY (RED):   Post 568 - korea-short-parental-leave-guide
- AI_BIZ_KR (GOLD): Post 580 - mcp-vs-skills-analysis
- AI_TREND_KR (PURPLE): Post 574 - ai-agent-tool-ecosystem-mcp-multica
- TECH_DIGEST (GREEN):  Post 583 - geeknews-top3-ai-agent-engineering
- AI_BIZ_EN (EMERALD):  Post 584 - ai-wearables-snap-qualcomm
- AI_TREND_EN (CYAN):   Post 588 - claude-ultraplan-musk-openai

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 작업 시작 전 자가 선언 (필수)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
첫 응답에서 반드시 다음 3문장을 포함할 것:
1. "POST-TEMPLATE-MASTER.md 템플릿 구조를 따른다"
2. "validate-post.js로 업로드 전 검증한다"
3. "검증 실패 시 publish 대신 draft로 업로드한다"

이 3문장이 첫 응답에 없으면 사용자가 작업 중단을 요청한다.
```

---

## 💡 왜 이 방식이 효과적인가

### 기존 프롬프트 실패 원인
1. **규칙이 추상적** — "이모지 금지"라 했지만 co-work는 `✓` 같은 체크 마크가 이모지인지 불분명
2. **검증 없음** — co-work 스스로 규칙 위반을 알아차릴 방법 없음
3. **보상 없음** — 규칙 준수가 작업 완료에 영향 없어 우선순위 낮음

### v2의 해결책
1. **템플릿 복제 방식** — 규칙을 외울 필요 없이 템플릿 채우기만
2. **기계적 검증** — `validate-post.js`가 11개 항목 자동 체크
3. **draft 안전장치** — 실패해도 publish 안 되니 공개 품질 유지
4. **자가 선언 강제** — 첫 응답에 규칙 인지 확인

---

## 🛠️ 사용자가 할 일

### 즉시
1. co-work 세션에 위 프롬프트 블록 전체 붙여넣기
2. co-work 첫 응답에 "POST-TEMPLATE-MASTER.md..." 문장 3개 있는지 확인
3. 없으면 작업 중단 요청

### 매일 아침
1. 어제 올라온 포스트 status 확인 (publish vs draft)
2. draft 많으면 co-work 프롬프트 재주입
3. publish된 것 샘플링 품질 체크

### 주 1회
1. CLAUDE.md 최신성 확인
2. 새로운 유형의 실수 발견되면 validate-post.js에 규칙 추가
