# aibizinsider.com — 프로젝트 운영 매뉴얼

**Claude Code 세션 간 공유용 컨텍스트 문서.**
이 파일은 새 포스트 작성·업로드·관리 시 반드시 참고할 규칙·구조·도구를 정리합니다. 동일 작업 반복 방지를 위해 여기 적힌 자산·규칙을 먼저 확인하세요.

---

## 1. 사이트 개요

- **URL**: https://aibizinsider.com
- **플랫폼**: WordPress.com Atomic / Personal Plan
- **플러그인**: Yoast SEO, LiteSpeed Cache, Site Kit by Google, Jetpack
- **Google 연동**: Search Console 등록, 사이트맵 제출, AdSense 승인 완료
- **테마**: Twenty Twenty-Five (수정 최소화, 콘텐츠 자체 스타일링 우선)
- **언어**: 한국어 + 영문 혼합 (카테고리로 분리)
- **발행 리듬**: 매일 1~5개 포스트 (시간대별 조간/석간)

## 2. 절대 규칙 (사용자 피드백 기반)

| 규칙 | 사유 |
|---|---|
| **이모지 금지** (🔥, 🏛️, 🎯 등 일체) | 사용자 피드백: "AI 느낌만 강하다". 디자인 이모티콘은 허용. |
| **Inline CSS만 사용** | WordPress.com personal plan은 외부 stylesheet 제약. `<style>` 블록은 wp:html 내부에서만. |
| **카테고리별 색상 차별화 필수** | "모두 똑같으면 재미 없잖아" — 카테고리마다 고유 그라데이션·보더·배지 색 유지. |
| **원문 사실 보존, 날조 금지** | 모든 수치·금액·날짜·인용구는 원문 소스와 일치해야 함. WebFetch로 검증 불가하면 일반 서술로 대체, 추측 금지. |
| **출처 URL 공개** | 각 포스트 하단에 원문 1차 소스 URL 필수 포함. |

## 3. 7개 카테고리 색상 시스템

참고 파일: `templates/color-system.json`

| 카테고리 ID | 이름 | 테마 | accent | dark BG | 그라데이션 |
|---|---|---|---|---|---|
| 778080398 | AI 비즈니스 (KR) | GOLD | `#fbbf24` / `#f59e0b` | `#0a1628` | `#0a1628 → #1a2e4a` |
| 768858600 | AI 트렌드 (KR) | PURPLE | `#a78bfa` / `#8b5cf6` | `#1e1b4b` | `#1e1b4b → #312e81` |
| 788391959 | AI Business (EN) | EMERALD | `#6ee7b7` / `#10b981` | `#022c22` | `#022c22 → #064e3b` |
| 788391957 | AI Trends (EN) | CYAN | `#67e8f9` / `#06b6d4` | `#0c4a6e` | `#0c4a6e → #155e75` |
| 788391976 | Tech Digest | GREEN | `#86efac` / `#22c55e` | `#052e16` | `#052e16 → #14532d` |
| 33592631, 788367641 | 정부정책 / 정책&민생 | RED | `#fca5a5` / `#ef4444` | `#450a0a` | `#450a0a → #7f1d1d` |
| 100532, 253219399 | 경제 / 테크&스타트업 | ORANGE | `#fdba74` / `#f97316` | `#431407` | `#431407 → #7c2d12` |

라벨도 카테고리 톤에 맞춤: TL;DR / KEY POINTS / KEY TAKEAWAYS / 핵심 정리 / DIGEST 등 (color-system.json의 `pin_label` 참조).

## 4. 포스트 구조 템플릿

모든 신규 포스트는 아래 블록 순서를 따르세요. 레퍼런스: `templates/post568_styled.txt` (RED), `post580_styled.txt` (GOLD), `post574_styled.txt` (PURPLE), `post583_styled.txt` (GREEN), `post584_styled.txt` (EMERALD), `post588_styled.txt` (CYAN).

```
<!-- wp:html -->
<div style="max-width:1120px; margin:0 auto; padding:24px; color:#334155;
     font-family:'Inter','Noto Sans KR',-apple-system,sans-serif; line-height:1.9;">

  1. Featured figure (이미지 + figcaption)
  2. TL;DR / KEY POINTS 박스 (카테고리 그라데이션)
  3. (반복) H2 섹션 제목 (카테고리 border-bottom)
     - H3 소제목 (카테고리 border-left)
     - 본문 단락
     - Analysis 박스 (italic, 카테고리 bg)
     - 구분선 hr
  4. By the Numbers / 표 (선택)
  5. Key Takeaways (선택)
  6. Related 섹션 (같은 카테고리 4~5개 내부 링크)
  7. Sources 섹션 (외부 원문 URL 리스트)
  8. Footer (카테고리 어두운 BG + 사이트명)
</div>
<!-- /wp:html -->
```

**핵심 스타일 값**:
- Body: `font-size:16px; line-height:1.9; color:#334155`
- H2: `font-size:28px; font-weight:800; border-bottom:3px solid [accent]`
- H3: `font-size:20px; border-left:4px solid [accent-light]`
- Analysis box: italic, `font-size:15px`, bg 카테고리 pastel, 좌측 5px 강조 보더
- Chips/badges: `letter-spacing:0.12em; text-transform:uppercase; font-size:11px`

## 5. 에디토리얼 규칙

- **제목**: 50자 내외, 키워드 앞쪽. 수치·회사명·날짜 포함 권장.
- **슬러그**: 영문 키워드만 (`%eb%85%84` 같은 한글 인코딩 금지). 60자 이하.
- **리드 문장**: 3~5개 핵심 사실을 TL;DR 박스 bullet로.
- **섹션당 1개 사실 박스** (Analysis), 추상적 코멘트 금지. 숫자·비교·함의만.
- **관련 글**: 같은 카테고리 4~5개 내부 링크, `href` 반드시 실제 존재하는 slug.
- **출처**: 최소 2개, 1차 소스 우선 (Bloomberg/TechCrunch/공식 블로그/정부 페이지).

## 6. 사용 가능한 자동화 자산

모두 `C:\00.AI개발\워드프레스블로그관리\` 하위.

### 템플릿 (참고용)
- `templates/color-system.json` — 카테고리 색상 토큰 마스터
- `templates/generate-styled-post.js` — 구조 기반 HTML 생성기 (Node)
- `templates/post{ID}_styled.txt` — 카테고리별 레퍼런스 포스트

### 운영 스크립트 (`scripts/`)
| 스크립트 | 용도 |
|---|---|
| `expand-related-links.js` | "관련 글" 섹션 2~3개 → 4~5개 확장 |
| `insert-body-links.js` | 본문에 자연스러운 내부 링크 자동 삽입 (포스트당 최대 3개) |
| `build-homepage.js` | 홈페이지 (Page ID 2) 재생성. 최신 포스트 API로 pull 후 업로드 |
| `README.md` | WordPress.com OAuth 토큰 발급 가이드 |

모든 스크립트는 `WPCOM_TOKEN` 환경변수 필요. 토큰 발급: https://developer.wordpress.com/apps/ (Client ID 137280 이미 등록됨).

### 기타
- `search-console-urls.txt` — 100개 URL 목록 (재색인 제출용)

## 7. WordPress.com API 직접 사용

### 인증
```bash
WPCOM_TOKEN="..."  # Bearer token
```

### 주요 엔드포인트
- 포스트 조회: `GET /rest/v1.1/sites/aibizinsider.com/posts/{id}`
- 포스트 업데이트: `POST /rest/v1.1/sites/aibizinsider.com/posts/{id}` body: `{content: "..."}`
- 포스트 생성: `POST /rest/v1.1/sites/aibizinsider.com/posts/new` body: `{title, content, status, categories}`
- 미디어 목록: `GET /rest/v1.1/sites/aibizinsider.com/media`
- 카테고리: `GET /rest/v1.1/sites/aibizinsider.com/categories`

### MCP 도구 (Claude Code에서 사용 시)
- `mcp__claude_ai_WordPress_com__wpcom-mcp-content-authoring` (action: `execute`, operation: `posts.create|posts.update|posts.get|media.update`)
- 모든 write 작업은 `params.user_confirmed: "yes"` 필수
- 대용량 content 응답 방지: `include_fields: ["id", "status"]` 지정

## 8. 발행 플로우 (신규 포스트)

### 8-1. 6단계 워크플로우

| 단계 | 역할 | 핵심 |
|---|---|---|
| 1. 토픽·키워드 리서치 | 정부24·정책브리핑·GeekNews 등 소스에서 이슈 수집, 검색량·경쟁도 확인 | 정책 공식명 ↔ 사용자 검색어 매핑 필수 |
| 2. 정책 데이터 수집 | WebFetch로 원문 2~5개 방문, 핵심 데이터(대상·금액·기간·채널) 구조화 추출 | 출처 URL·발행일 반드시 기록 |
| 3. 콘텐츠 생성 | 4장 템플릿 구조, 카테고리 색상 적용, 이모지 금지 | 제목 공식 적용 (아래 참조) |
| 4. 검수·팩트체크 | 수치·일자·자격요건 교차 검증, 키워드 남발 제거 | 공식 문서와 1:1 대조 |
| 5. SEO 최적화 | 제목 훅 적용, meta description 수동 작성, 이미지 ALT, 내부링크 | Yoast meta 120자 이내 행동유도 문구 |
| 6. 배포·모니터링 | 업로드 → 대표이미지 설정 → 발행 | 마감 정책은 종료 라벨 추가 |

### 8-2. 제목 작성 공식 (유튜브 썸네일 스타일)

**절대 원칙:**
- 20자 이내가 황금 (한글 기준)
- ...으로 끊어 궁금증 강제 생성
- 제목에서 절대 답을 주지 않는다
- 보도자료 헤드라인 스타일 금지

**훅 키워드:**
- 감정: "소름", "미쳤다", "충격", "멘붕", "패닉"
- 궁금증: "...한 짓", "진짜 이유", "이렇게 됐습니다"
- 손실공포: "모르면 손해", "놓치면 끝", "안 하면 호구"
- 체험: "써봤더니", "비교했더니", "뜯어봤더니"
- 대화체: "아직도 안 받았어요?", "사장님", "당장 확인"

**카테고리별 패턴:**
- 정부정책: "월 20만원 공짜로 준다는데..." / "당장 통장 확인 —"
- AI 비즈니스: "마케팅팀 전원 해고됐습니다..." / "견적 뜯어봤더니 미쳤다"
- AI 트렌드: "27년간 숨어있던 버그...AI가 찾아버림" / "투자자가 쫓겨남"
- Tech Digest: "Django 쓰는 사람 지금 멈춰" / "백준 죽는다"
- EN 포스트: "Google Just Made X Obsolete" / "— And They Signed Up for It"

### 8-3. Meta Description 작성 규칙

- 120자 이내, 한국어 기준
- 1문장: 핵심 팩트 + 숫자
- 2문장: 행동 유도 ("지금 확인하세요", "놓치지 마세요")
- 키워드 1~2회 자연 포함, 남발 금지

### 8-4. 대표이미지

- **포스트마다 고유 이미지 필수** (동일 이미지 재사용 금지)
- Canva 또는 Gemini API로 제작, 1200x630px
- 유튜브 썸네일 스타일: 큰 텍스트 1줄 + 카테고리 색상 배경
- alt_text 필수

### 8-5. 정책 포스트 추가 규칙

- 마감된 정책: 제목 앞에 [마감] 또는 본문 상단에 종료 배너 추가
- FAQ 섹션: 자주 묻는 질문 2~3개 포함 (구조화 데이터 효과)
- "누가·언제·얼마나·어떻게" 구조 필수

## 9. 이미 완료된 작업 (중복 금지)

- ✅ 110+ 포스트 스타일 재구성 (7 색상 체계 적용)
- ✅ 슬러그 최적화 48개 + 대표이미지 100개 Canva 제작 (featured image alt 설정)
- ✅ SEO: canonical (Yoast 자동), sitemap 제출, meta description `%%excerpt%%`
- ✅ 내부 링크: 깨진 링크 21개 수정, 관련 글 +51 포스트 확장, 본문 링크 180개 추가
- ✅ 댓글·핑백 정리 (41개 삭제, 비활성화)
- ✅ 홈페이지 편집자 스타일 리디자인 (Page ID 2, Magic UI 스타일 애니메이션, Pretendard 통일 폰트)
- ✅ AI_TREND_EN 10개 WebFetch 기반 팩트 재검증
- ✅ 최근 20개 포스트 제목 리뉴얼 (유튜브 썸네일 스타일, 2026-04-16)
- ✅ CLAUDE.md 발행 워크플로우 6단계 + 제목 공식 + meta description 규칙 추가

## 10. 남은 작업 / 알려진 이슈

- ⚠️ **레거시 포스트 11개**: URL-encoded Korean slug (post ID 91, 95, 86, 65, 21, 22, 24, 28, 32, 36, 14). 슬러그 수동 변경 + 구조화 재작성 필요.
- ⚠️ **미사용 레거시 이미지 ~33개**: autofill-XXX, pexels-photo-XXX 이름. 삭제는 destructive라 사용자 승인 필요.
- ⚠️ **Tech Digest 카테고리 포스트 1개뿐**: 콘텐츠 확장 필요 시 고려.

## 11. 네이밍 규칙

- **파일명**: snake_case 또는 kebab-case. 예: `post568_styled.txt`, `expand-related-links.js`
- **slug**: 영문 kebab-case, 60자 이하. 예: `ai-pricing-strategy-openai-sierra-poke-april-10-2026`
- **대표이미지 파일명**: `{주제}-thumbnail.png` 형식. Canva 제작 후 1200x630.

## 12. 경계 지점 (사용자 승인 필요)

- 포스트 대량 삭제 / 상태 변경 (publish→draft)
- 미디어 파일 삭제
- 사이트 설정 변경 (theme, permalink, reading)
- 카테고리 추가·삭제·병합
- 플러그인 설치·제거

다른 Claude Code 세션에서 위 작업을 요청받으면 사용자 확인을 받은 후 진행.

---

**마지막 업데이트**: 2026-04-16
**관리자**: 김나르도 (WordPress.com admin)
