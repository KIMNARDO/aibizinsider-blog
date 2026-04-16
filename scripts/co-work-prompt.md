# co-work 세션 붙여넣기 프롬프트

아래 블록을 Claude Code co-work 대화 시작 시 복사-붙여넣기 하세요.

---

## 📋 프롬프트 (복사해서 사용)

```
너는 aibizinsider.com(WordPress.com Personal) 블로그에 새 포스트를 작성·업로드하는 작업을 한다.
이 사이트는 이미 110+ 포스트가 정교한 디자인 시스템으로 구조화되어 있다.
다음 규칙을 절대 어기지 말고, 동일 작업을 중복하지 마라.

━━━ 절대 규칙 ━━━
1. 이모지 금지 (🔥, 🏛️, 🎯, ⚡ 등 모두 X). "AI 느낌"을 준다는 사용자 피드백.
2. Inline CSS만 사용. 모든 포스트는 `<!-- wp:html -->` 래퍼 안에 작성.
3. 카테고리마다 고유 색상 사용 (획일화 금지). 색상 시스템은 아래 참조.
4. 원문 사실 보존. WebFetch로 1차 소스 확인 후 수치·날짜·회사명 정확히 인용. 추측 금지.
5. 모든 포스트 하단에 "Sources" (외부 URL 2+), "Related" (같은 카테고리 내부 링크 4~5개) 필수.

━━━ 카테고리 ID · 색상 ━━━
| ID | 이름 | accent | dark BG | 그라데이션 |
|---|---|---|---|---|
| 778080398 | AI 비즈니스 (KR) | #fbbf24 | #0a1628 | #0a1628→#1a2e4a |
| 768858600 | AI 트렌드 (KR) | #a78bfa | #1e1b4b | #1e1b4b→#312e81 |
| 788391959 | AI Business (EN) | #10b981 | #022c22 | #022c22→#064e3b |
| 788391957 | AI Trends (EN) | #06b6d4 | #0c4a6e | #0c4a6e→#155e75 |
| 788391976 | Tech Digest | #22c55e | #052e16 | #052e16→#14532d |
| 788367641 | 정책 & 민생 | #ef4444 | #450a0a | #450a0a→#7f1d1d |
| 33592631 | 정부정책 | #ef4444 | #450a0a | 동일 |
| 100532 | 경제 | #f97316 | #431407 | #431407→#7c2d12 |

━━━ 필수 포스트 구조 ━━━
`<!-- wp:html -->` 래퍼 안에:
1. Featured figure (img + figcaption, 1200x630 권장)
2. TL;DR / KEY POINTS 박스 (카테고리 그라데이션, 3~5 bullet)
3. H2 섹션 (category accent border-bottom 3px) + H3 서브(border-left 4px) + 본문 단락 + Analysis 박스(italic, 카테고리 pastel bg)
4. 표·By the Numbers (선택)
5. Related 섹션 (같은 카테고리 4~5개, 실제 존재하는 slug 확인 필수)
6. Sources 섹션 (외부 1차 URL)
7. Footer: "AI Biz Insider · [카테고리명] · aibizinsider.com"

━━━ 참고 템플릿 파일 ━━━
`C:\00.AI개발\워드프레스블로그관리\templates\` 디렉토리:
- post568_styled.txt (RED 정책)
- post574_styled.txt (PURPLE AI 트렌드)
- post580_styled.txt (GOLD AI 비즈니스)
- post583_styled.txt (GREEN Tech Digest)
- post584_styled.txt (EMERALD AI Business EN)
- post588_styled.txt (CYAN AI Trends EN)
- color-system.json (마스터 색상 토큰)

신규 포스트 작성 시 해당 카테고리 템플릿을 먼저 읽고 구조를 복제하라.

━━━ 슬러그 규칙 ━━━
- 영문 kebab-case만 (한글 %eb%85%84 인코딩 금지)
- 60자 이하
- 키워드 + 날짜 포함 권장. 예: `ai-pricing-strategy-openai-april-10-2026`

━━━ 업로드 방법 ━━━
WordPress.com MCP:
  mcp__claude_ai_WordPress_com__wpcom-mcp-content-authoring
  action: "execute"
  operation: "posts.create" (신규) 또는 "posts.update" (수정)
  wpcom_site: "aibizinsider.com"
  params: { title, content, status: "publish", categories: [CAT_ID], user_confirmed: "yes" }

또는 REST API 직접 호출 (토큰 필요): POST /rest/v1.1/sites/aibizinsider.com/posts/new

━━━ Related 링크 확보 방법 ━━━
같은 카테고리 최근 포스트 조회:
  operation: "posts.list"
  params: { category: [CAT_ID], number: 5, fields: ["ID","title","URL"] }

━━━ 완료 작업 (중복 금지) ━━━
- 110+ 기존 포스트 스타일 재구성 완료 (재작업 금지)
- 홈페이지 Page ID 2 최근 리디자인 완료 (수정 금지, build-homepage.js로만 갱신)
- 이미지 alt, canonical, 내부 링크 유효성 검증 완료
- 레거시 포스트 11개 (ID 91, 95, 86, 65, 21, 22, 24, 28, 32, 36, 14)는 URL-encoded slug 상태 — 수정 전 사용자 확인

━━━ 사용자 승인 필요 작업 ━━━
- 포스트 삭제·status 변경
- 미디어 삭제
- 카테고리 추가·변경
- 사이트 설정 수정

━━━ 품질 체크 ━━━
업로드 전 확인:
- [ ] 이모지 없음
- [ ] 카테고리 색상 정확
- [ ] 원문 사실 정확 (수치·회사명·날짜)
- [ ] Sources 최소 2개, Related 4~5개
- [ ] slug 영문, 60자 이하
- [ ] <!-- wp:html --> 래퍼 포함
- [ ] 대표이미지 alt 설정

상세 매뉴얼: `C:\00.AI개발\워드프레스블로그관리\CLAUDE.md` 참고.
```

---

## 💡 사용 팁

1. **같은 디렉토리에서 co-work 실행 시**: `CLAUDE.md`를 Claude Code가 자동 로드하므로 위 프롬프트 불필요 (혹은 보조용으로 첨부).
2. **다른 디렉토리/툴에서 co-work 실행 시**: 위 프롬프트 블록 전체를 첫 메시지에 붙여넣기.
3. **새 카테고리 추가 시**: CLAUDE.md와 이 파일의 색상 테이블, color-system.json을 함께 업데이트.
4. **규칙 변경 시**: 이 파일과 CLAUDE.md 양쪽 모두 수정해야 일관성 유지.
