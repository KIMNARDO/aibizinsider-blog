"""Generate gold-styled HTML for AI_BIZ_KR posts."""
import json

def gen(title, tldr_headline, tldr_bullets, sections, sources, related, analysis):
    """
    title: post title (not rendered in content since WP renders title separately)
    tldr_headline: one-sentence TL;DR headline
    tldr_bullets: list of (text, highlight_term) tuples; highlight_term marked in gold
    sections: list of dicts with keys h2, body (list of paragraphs), h3s (list of (title, body))
    sources: list of (label, url) tuples
    related: list of (label, url) tuples
    analysis: paragraph of AI Biz Insider 분석 text
    """
    parts = ["<!-- wp:html -->\n<div style=\"max-width:720px;margin:0 auto;font-family:'Pretendard','Noto Sans KR',sans-serif;\">"]

    # TL;DR box
    parts.append('<div style="background:linear-gradient(135deg,#0a1628 0%,#1a2e4a 100%);border-radius:12px;padding:28px 32px;margin:32px 0;">')
    parts.append('<p style="margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:0.12em;color:#fbbf24;text-transform:uppercase;">TL;DR</p>')
    parts.append(f'<p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#fbbf24;line-height:1.4;">{tldr_headline}</p>')
    parts.append('<ul style="margin:0;padding-left:20px;color:#e2e8f0;font-size:15px;line-height:1.9;">')
    for b in tldr_bullets:
        parts.append(f'<li>{b}</li>')
    parts.append('</ul></div>')

    # Sections
    for sec in sections:
        parts.append(f'<h2 style="font-size:28px;font-weight:700;color:#0f172a;border-bottom:3px solid #f59e0b;padding-bottom:10px;margin-top:40px;line-height:1.4;">{sec["h2"]}</h2>')
        for p in sec.get("body", []):
            parts.append(f'<p style="font-size:16px;color:#334155;line-height:1.9;">{p}</p>')
        for h3, body in sec.get("h3s", []):
            parts.append(f'<h3 style="font-size:20px;font-weight:700;color:#92400e;border-left:4px solid #fbbf24;padding-left:14px;margin-top:36px;">{h3}</h3>')
            parts.append(f'<p style="font-size:16px;color:#334155;line-height:1.9;">{body}</p>')

    # Analysis box
    if analysis:
        parts.append('<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:22px 24px;margin:24px 0;">')
        parts.append('<p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#f59e0b;text-transform:uppercase;">AI Biz Insider 분석</p>')
        parts.append(f'<p style="margin:12px 0 0;font-size:16px;color:#78350f;line-height:1.9;font-style:italic;">{analysis}</p></div>')

    parts.append('<hr style="border:none;border-top:1px solid #e2e8f0;margin:40px 0;" />')

    # Sources
    parts.append('<div style="background:#fffbeb;border:1px solid #f59e0b;border-radius:8px;padding:20px 24px;margin:0 0 24px;">')
    parts.append('<p style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#f59e0b;text-transform:uppercase;">출처</p>')
    for label, url in sources:
        parts.append(f'<p style="margin:0 0 6px;font-size:14px;color:#334155;"><a href="{url}" style="color:#f59e0b;" target="_blank" rel="noopener">{label}</a></p>')
    parts.append('</div>')

    # Related
    parts.append('<div style="background:#fffbeb;border:1px solid #f59e0b;border-radius:8px;padding:20px 24px;margin:0 0 40px;">')
    parts.append('<p style="margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#f59e0b;text-transform:uppercase;">관련 글</p>')
    parts.append('<ul style="margin:0;padding-left:18px;color:#334155;font-size:15px;line-height:2;">')
    for label, url in related:
        parts.append(f'<li><a href="{url}" style="color:#f59e0b;text-decoration:none;">{label}</a></li>')
    parts.append('</ul></div>')

    # Footer
    parts.append('<div style="background:#0f172a;border-radius:10px;padding:22px 28px;text-align:center;">')
    parts.append('<p style="margin:0;font-size:14px;color:#94a3b8;letter-spacing:0.04em;">AI Biz Insider · AI 비즈니스 · <a href="https://aibizinsider.com" style="color:#fbbf24;text-decoration:none;">aibizinsider.com</a></p>')
    parts.append('</div>\n</div>\n<!-- /wp:html -->')

    return "\n".join(parts)


if __name__ == "__main__":
    import sys
    data = json.load(open(sys.argv[1], encoding="utf-8"))
    html = gen(**data)
    with open(sys.argv[2], "w", encoding="utf-8") as f:
        f.write(html)
