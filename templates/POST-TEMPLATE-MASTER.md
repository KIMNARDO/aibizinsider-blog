# 포스트 템플릿 마스터 — co-work 반드시 준수

새 포스트 작성 시 아래 템플릿을 **그대로 복제**한 후 `{{변수}}` 부분만 치환하세요.
템플릿을 벗어나거나 구조를 변경하지 마세요.

---

## 🎨 카테고리별 색상 치환표

작성 전 해당 카테고리의 색상 값을 아래에서 찾아 템플릿의 `{{ACCENT}}`, `{{DARK_BG}}`, `{{GRAD1}}`, `{{GRAD2}}`, `{{LABEL}}`에 대입하세요.

| 카테고리 ID | 이름 | {{ACCENT}} | {{DARK_BG}} | {{GRAD1}} | {{GRAD2}} | {{LABEL}} |
|---|---|---|---|---|---|---|
| 778080398 | AI 비즈니스 | `#f59e0b` | `#0a1628` | `#0a1628` | `#1a2e4a` | `TL;DR` |
| 768858600 | AI 트렌드 | `#8b5cf6` | `#1e1b4b` | `#1e1b4b` | `#312e81` | `TL;DR` |
| 788391959 | AI Business (EN) | `#10b981` | `#022c22` | `#022c22` | `#064e3b` | `KEY TAKEAWAYS` |
| 788391957 | AI Trends (EN) | `#06b6d4` | `#0c4a6e` | `#0c4a6e` | `#155e75` | `KEY POINTS` |
| 788391976 | Tech Digest | `#22c55e` | `#052e16` | `#052e16` | `#14532d` | `DIGEST` |
| 788367641 | 정책 & 민생 | `#ef4444` | `#450a0a` | `#450a0a` | `#7f1d1d` | `핵심 정리` |
| 33592631 | 정부정책 | `#ef4444` | `#450a0a` | `#450a0a` | `#7f1d1d` | `핵심 정리` |
| 100532 | 경제 | `#f97316` | `#431407` | `#431407` | `#7c2d12` | `핵심 정리` |

---

## 📄 포스트 HTML 템플릿 (전체 복제)

```html
<!-- wp:html -->
<div style="max-width:1120px;margin:0 auto;padding:24px;color:#334155;font-family:'Pretendard','Noto Sans KR',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.9;font-size:16px;">

<!-- Featured Figure (대표 이미지 URL 필수) -->
<figure style="margin:0 0 32px 0;">
  <img src="{{FEATURED_IMAGE_URL}}" alt="{{ALT_TEXT_한국어_10자이상}}" style="width:100%;height:auto;display:block;border-radius:16px;max-height:420px;object-fit:cover;"/>
</figure>

<!-- TL;DR 박스 (카테고리 그라데이션) -->
<div style="background:linear-gradient(135deg,{{GRAD1}} 0%,{{GRAD2}} 100%);border-radius:16px;padding:28px 32px;margin-bottom:36px;">
  <div style="font-size:11px;color:{{ACCENT}};letter-spacing:0.18em;font-weight:700;margin-bottom:12px;">{{LABEL}}</div>
  <ul style="margin:0;padding-left:20px;color:#e2e8f0;font-size:15px;line-height:1.95;">
    <li style="margin-bottom:8px;">{{핵심_포인트_1}}</li>
    <li style="margin-bottom:8px;">{{핵심_포인트_2}}</li>
    <li style="margin-bottom:8px;">{{핵심_포인트_3}}</li>
    <li style="margin-bottom:0;">{{핵심_포인트_4}}</li>
  </ul>
</div>

<!-- 리드 단락 -->
<p style="font-size:17px;line-height:1.9;margin:0 0 32px 0;">{{리드_단락_3_4_문장}}</p>

<!-- ============= 섹션 반복 구조 ============= -->
<h2 style="font-size:28px;font-weight:800;color:#0f172a;border-bottom:3px solid {{ACCENT}};padding-bottom:12px;margin:48px 0 20px 0;line-height:1.3;">{{섹션_제목}}</h2>

<h3 style="font-size:20px;font-weight:700;color:{{DARK_BG}};border-left:4px solid {{ACCENT}};padding-left:12px;margin:32px 0 14px 0;">{{서브_제목}}</h3>

<p style="margin:0 0 16px 0;">{{본문_단락}}</p>

<!-- 분석 박스 (선택적, 핵심 통찰용) -->
<div style="background:#fef3c7;border-left:5px solid {{ACCENT}};border-radius:10px;padding:20px 24px;margin:24px 0;">
  <p style="margin:0;font-size:15px;line-height:1.85;color:{{DARK_BG}};font-style:italic;">
    <strong>AI Biz Insider 분석 ―</strong> {{분석_코멘트}}
  </p>
</div>

<!-- 섹션 구분선 -->
<hr style="border:none;border-top:1px solid #e2e8f0;margin:48px 0;"/>

<!-- ============= Related (같은 카테고리 4~5개 필수) ============= -->
<h2 style="font-size:28px;font-weight:800;color:#0f172a;border-bottom:3px solid {{ACCENT}};padding-bottom:12px;margin:48px 0 20px 0;">관련 글</h2>
<ul style="margin:0 0 32px 0;padding-left:22px;font-size:15px;line-height:2.1;">
  <li><a href="{{URL_1_실제존재슬러그}}" style="color:{{ACCENT}};text-decoration:none;font-weight:600">{{제목_1}}</a></li>
  <li><a href="{{URL_2_실제존재슬러그}}" style="color:{{ACCENT}};text-decoration:none;font-weight:600">{{제목_2}}</a></li>
  <li><a href="{{URL_3_실제존재슬러그}}" style="color:{{ACCENT}};text-decoration:none;font-weight:600">{{제목_3}}</a></li>
  <li><a href="{{URL_4_실제존재슬러그}}" style="color:{{ACCENT}};text-decoration:none;font-weight:600">{{제목_4}}</a></li>
</ul>

<!-- ============= Sources (외부 URL 2+ 필수) ============= -->
<h2 style="font-size:28px;font-weight:800;color:#0f172a;border-bottom:3px solid {{ACCENT}};padding-bottom:12px;margin:48px 0 20px 0;">출처</h2>
<ol style="margin:0 0 32px 0;padding-left:22px;font-size:14px;line-height:2;color:#475569;">
  <li><a href="{{외부_URL_1}}" target="_blank" rel="noopener noreferrer" style="color:{{DARK_BG}};">{{출처_제목_1}}</a></li>
  <li><a href="{{외부_URL_2}}" target="_blank" rel="noopener noreferrer" style="color:{{DARK_BG}};">{{출처_제목_2}}</a></li>
</ol>

<!-- ============= 푸터 (변경 금지) ============= -->
<div style="background:{{DARK_BG}};border-radius:12px;padding:20px 28px;margin-top:32px;text-align:center;">
  <p style="font-size:13px;color:#94a3b8;margin:0;">AI Biz Insider · {{카테고리명}} · aibizinsider.com</p>
</div>

</div>
<!-- /wp:html -->
```

---

## 📋 업로드 필수 체크리스트 (Publish 전 자체 검증)

아래 10개 항목 중 **하나라도 실패하면 status: 'publish' 대신 'draft'로 업로드**하세요.

- [ ] `<!-- wp:html -->` 래퍼로 감쌌는가
- [ ] TL;DR(혹은 KEY POINTS/핵심 정리) 박스가 카테고리 그라데이션으로 적용됐는가
- [ ] H2 border-bottom 색상이 카테고리 {{ACCENT}}인가
- [ ] H3 border-left 색상이 카테고리 {{ACCENT}}인가
- [ ] 관련 글 섹션이 4개 이상이고 모두 **실존하는 slug**인가
- [ ] 출처 섹션이 외부 URL 2개 이상인가
- [ ] 푸터에 "AI Biz Insider · [카테고리명] · aibizinsider.com" 있는가
- [ ] 이모지(🔥🏛️🎯⚡✅❌ 등) 없는가 (체크 마크는 SVG로)
- [ ] slug가 영문 kebab-case 60자 이하인가 (한글 인코딩 %ea% 절대 금지)
- [ ] featured_image 명시적으로 설정됐는가 (미디어 ID 포함)

---

## 🚫 절대 하지 말아야 할 것

1. 템플릿 구조 생략 (TL;DR, 관련 글, 출처, 푸터)
2. 이모지 사용
3. 슬러그 한글 인코딩 (`%ea%b3%a0...` 형태)
4. 카테고리 "미분류"로 업로드 (반드시 7개 카테고리 중 하나)
5. featured_image 없이 publish
6. 존재하지 않는 slug를 관련 글에 삽입
7. Inline CSS 아닌 외부 스타일시트 참조
