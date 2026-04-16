"""Generate AI_TREND_KR styled HTML posts (purple theme) for batch."""
import json
import os

# Purple theme colors
H2_STYLE = 'font-size:28px;font-weight:700;color:#1e1b4b;border-bottom:3px solid #8b5cf6;padding-bottom:10px;margin:36px 0 20px 0;'
H3_STYLE = 'font-size:20px;font-weight:700;color:#5b21b6;border-left:4px solid #a78bfa;padding-left:14px;margin:28px 0 14px 0;'
P_STYLE = 'font-size:16px;line-height:1.9;color:#334155;'
DATE_BADGE = 'display:inline-block;background:#5b21b6;color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:4px;margin-bottom:12px;'
LINK_STYLE = 'color:#7c3aed;font-size:14px;text-decoration:none;border-bottom:1px solid #a78bfa;'


def build_post(title, subtitle, date_str, tldr_bullets, sections, sources, related, footer_date):
    """
    sections: list of dicts {h3, date_badge, paragraphs:[...], insight}
    sources: list of (label, url)
    related: list of (label, url)
    """
    parts = []

    # TL;DR
    parts.append('<!-- wp:html -->')
    parts.append('<div style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 100%);border-radius:16px;padding:32px 36px;margin:0 0 32px 0;box-shadow:0 6px 24px rgba(30,27,75,0.22);">')
    parts.append('  <div style="font-size:12px;color:#a78bfa;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;margin-bottom:14px;">TL;DR</div>')
    parts.append(f'  <p style="font-weight:800;font-size:22px;color:#ffffff;margin:0 0 14px 0;line-height:1.35;border-left:4px solid #8b5cf6;padding-left:16px;">{title}</p>')
    parts.append(f'  <p style="font-size:15px;color:#a78bfa;font-weight:600;margin:0 0 16px 0;">{subtitle}</p>')
    parts.append('  <ul style="margin:0;padding-left:20px;list-style:none;">')
    for b in tldr_bullets:
        parts.append(f'    <li style="margin-bottom:10px;font-size:15px;line-height:1.85;color:#c4b5fd;padding-left:4px;">{b}</li>')
    parts.append('  </ul>')
    parts.append('</div>')
    parts.append('<!-- /wp:html -->')

    # Separator
    parts.append('<!-- wp:separator {"style":{"color":{"background":"#e2e8f0"}}} -->')
    parts.append('<hr class="wp-block-separator has-text-color has-background" style="background-color:#e2e8f0;border-color:#e2e8f0"/>')
    parts.append('<!-- /wp:separator -->')

    # Main H2
    parts.append('<!-- wp:heading {"level":2} -->')
    parts.append(f'<h2 style="{H2_STYLE}">핵심 이슈 심층 분석</h2>')
    parts.append('<!-- /wp:heading -->')

    # Sections
    for sec in sections:
        parts.append('<!-- wp:heading {"level":3} -->')
        parts.append(f'<h3 style="{H3_STYLE}">{sec["h3"]}</h3>')
        parts.append('<!-- /wp:heading -->')

        if sec.get('date_badge'):
            parts.append('<!-- wp:html -->')
            parts.append(f'<div style="{DATE_BADGE}">{sec["date_badge"]}</div>')
            parts.append('<!-- /wp:html -->')

        for para in sec['paragraphs']:
            parts.append('<!-- wp:paragraph -->')
            parts.append(f'<p style="{P_STYLE}">{para}</p>')
            parts.append('<!-- /wp:paragraph -->')

        if sec.get('insight'):
            parts.append('<!-- wp:html -->')
            parts.append('<div style="background:#ede9fe;border-left:4px solid #8b5cf6;border-radius:0 12px 12px 0;padding:20px 24px;margin:20px 0 28px 0;">')
            parts.append('  <p style="font-weight:700;color:#5b21b6;margin:0 0 10px 0;font-size:15px;">Trend Insight</p>')
            parts.append(f'  <p style="font-size:15px;line-height:1.8;color:#5b21b6;margin:0;">{sec["insight"]}</p>')
            parts.append('</div>')
            parts.append('<!-- /wp:html -->')

        parts.append('<!-- wp:separator {"style":{"color":{"background":"#e2e8f0"}}} -->')
        parts.append('<hr class="wp-block-separator has-text-color has-background" style="background-color:#e2e8f0;border-color:#e2e8f0"/>')
        parts.append('<!-- /wp:separator -->')

    # 출처
    parts.append('<!-- wp:heading {"level":2} -->')
    parts.append(f'<h2 style="{H2_STYLE}">출처</h2>')
    parts.append('<!-- /wp:heading -->')
    parts.append('<!-- wp:html -->')
    parts.append('<div style="background:#f8fafc;border:1px solid #c4b5fd;border-radius:12px;padding:24px;margin:0 0 28px 0;">')
    parts.append('  <ul style="margin:0;padding-left:18px;">')
    for label, url in sources:
        parts.append(f'    <li style="margin-bottom:10px;font-size:15px;line-height:1.7;"><a href="{url}" target="_blank" rel="noopener noreferrer" style="{LINK_STYLE}">{label}</a></li>')
    parts.append('  </ul>')
    parts.append('</div>')
    parts.append('<!-- /wp:html -->')

    # 관련 글
    parts.append('<!-- wp:heading {"level":2} -->')
    parts.append(f'<h2 style="{H2_STYLE}">관련 글</h2>')
    parts.append('<!-- /wp:heading -->')
    parts.append('<!-- wp:html -->')
    parts.append('<div style="background:#f8fafc;border:1px solid #c4b5fd;border-radius:12px;padding:24px;margin:0 0 40px 0;">')
    parts.append('  <ul style="margin:0;padding-left:18px;">')
    for label, url in related:
        parts.append(f'    <li style="margin-bottom:10px;font-size:15px;line-height:1.7;"><a href="{url}" target="_blank" rel="noopener noreferrer" style="{LINK_STYLE}">{label}</a></li>')
    parts.append('  </ul>')
    parts.append('</div>')
    parts.append('<!-- /wp:html -->')

    # Footer
    parts.append('<!-- wp:separator {"style":{"color":{"background":"#e2e8f0"}}} -->')
    parts.append('<hr class="wp-block-separator has-text-color has-background" style="background-color:#e2e8f0;border-color:#e2e8f0"/>')
    parts.append('<!-- /wp:separator -->')
    parts.append('<!-- wp:html -->')
    parts.append('<div style="background:#1e1b4b;border-radius:12px;padding:24px 28px;margin:32px 0 0 0;text-align:center;">')
    parts.append('  <p style="font-size:13px;color:#a78bfa;margin:0;letter-spacing:0.04em;">AI Biz Insider · AI 트렌드 · aibizinsider.com</p>')
    parts.append(f'  <p style="font-size:12px;color:#6d6aaa;margin:8px 0 0 0;">{footer_date}</p>')
    parts.append('</div>')
    parts.append('<!-- /wp:html -->')

    return '\n\n'.join(parts)


# Related posts pool within AI_TREND_KR category
RELATED_POOL = [
    ('AI 에이전트 도구 생태계 재편 — MCP, multica, Axios, Shopify (2026-04-11)', 'https://aibizinsider.com/2026/04/11/ai-agent-tools-mcp-multica-axios-shopify-april-11-2026/'),
    ('AI 개발 도구 모니터링 자동화 시대 (2026-04-10 저녁)', 'https://aibizinsider.com/2026/04/10/ai-dev-monitoring-claude-openai-gemini-apr-10/'),
    ('AI 에이전트 아키텍처 전환 — Advisor 패턴, Gemini 3D, OpenAI Frontier (2026-04-10)', 'https://aibizinsider.com/2026/04/10/ai-agent-architecture-advisor-gemini-openai-meta-april-10-2026/'),
    ('Claude Managed Agents 공개 (2026-04-09 저녁)', 'https://aibizinsider.com/2026/04/09/claude-managed-agents-2026-04-09-evening/'),
    ('AI 에이전트 전면화 — Claude Mythos, OpenAI 엔터프라이즈, Gemma 4 (2026-04-09)', 'https://aibizinsider.com/2026/04/09/ai-agent-claude-mythos-openai-enterprise-gemma4-april-9-2026/'),
    ('Claude Mythos 프리뷰 공개 — Glasswing, GLM-5.1, agent-skills (2026-04-08)', 'https://aibizinsider.com/2026/04/08/claude-mythos-glasswing-glm51-agent-skills-april-8-2026/'),
]


def pick_related(exclude_url, n=3):
    out = []
    for label, url in RELATED_POOL:
        if url == exclude_url:
            continue
        out.append((label, url))
        if len(out) >= n:
            break
    return out


if __name__ == '__main__':
    print('OK')
