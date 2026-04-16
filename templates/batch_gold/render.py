# -*- coding: utf-8 -*-
"""Render gold-styled HTML and output JSON for MCP upload."""
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from posts_data import POSTS

TEMPLATE = """<!-- wp:html -->
<div style="max-width:720px;margin:0 auto;font-family:'Pretendard','Noto Sans KR',sans-serif;">
<div style="background:linear-gradient(135deg,#0a1628 0%,#1a2e4a 100%);border-radius:12px;padding:28px 32px;margin:32px 0;"><p style="margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:0.12em;color:#fbbf24;text-transform:uppercase;">TL;DR</p><p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#fbbf24;line-height:1.4;">{headline}</p><ul style="margin:0;padding-left:20px;color:#e2e8f0;font-size:15px;line-height:1.9;">{bullets}</ul></div>
{sections}
<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:22px 24px;margin:24px 0;"><p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#f59e0b;text-transform:uppercase;">AI Biz Insider 분석</p><p style="margin:12px 0 0;font-size:16px;color:#78350f;line-height:1.9;font-style:italic;">{analysis}</p></div>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:40px 0;" />
<div style="background:#fffbeb;border:1px solid #f59e0b;border-radius:8px;padding:20px 24px;margin:0 0 24px;"><p style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#f59e0b;text-transform:uppercase;">출처</p>{sources}</div>
<div style="background:#fffbeb;border:1px solid #f59e0b;border-radius:8px;padding:20px 24px;margin:0 0 40px;"><p style="margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#f59e0b;text-transform:uppercase;">관련 글</p><ul style="margin:0;padding-left:18px;color:#334155;font-size:15px;line-height:2;">{related}</ul></div>
<div style="background:#0f172a;border-radius:10px;padding:22px 28px;text-align:center;"><p style="margin:0;font-size:14px;color:#94a3b8;letter-spacing:0.04em;">AI Biz Insider · AI 비즈니스 · <a href="https://aibizinsider.com" style="color:#fbbf24;text-decoration:none;">aibizinsider.com</a></p></div>
</div>
<!-- /wp:html -->"""

def render(pid, data):
    bullets = "".join(f'<li>{b}</li>' for b in data["bullets"])
    secs = []
    for h2, body, h3, h3body in data["sections"]:
        secs.append(f'<h2 style="font-size:28px;font-weight:700;color:#0f172a;border-bottom:3px solid #f59e0b;padding-bottom:10px;margin-top:40px;line-height:1.4;">{h2}</h2>')
        secs.append(f'<p style="font-size:16px;color:#334155;line-height:1.9;">{body}</p>')
        secs.append(f'<h3 style="font-size:20px;font-weight:700;color:#92400e;border-left:4px solid #fbbf24;padding-left:14px;margin-top:36px;">{h3}</h3>')
        secs.append(f'<p style="font-size:16px;color:#334155;line-height:1.9;">{h3body}</p>')
    sources = "".join(f'<p style="margin:0 0 6px;font-size:14px;color:#334155;"><a href="{u}" style="color:#f59e0b;" target="_blank" rel="noopener">{l}</a></p>' for l, u in data["sources"])
    related = "".join(f'<li><a href="{u}" style="color:#f59e0b;text-decoration:none;">{l}</a></li>' for l, u in data["related"])
    return TEMPLATE.format(headline=data["headline"], bullets=bullets, sections="\n".join(secs), analysis=data["analysis"], sources=sources, related=related)

out = {}
for pid, data in POSTS.items():
    out[pid] = render(pid, data)

with open(os.path.join(os.path.dirname(__file__), "rendered.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False)

print(f"Rendered {len(out)} posts")
for pid in out:
    print(f"  {pid}: {len(out[pid])} chars")
