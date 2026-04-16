// POLICY batch styled HTML builder
// Reusable function returning a POLICY-themed styled post body

function buildPolicyPost({
  eyebrow, title, subtitle,
  tldr, // array of {label, text}
  intro, // string of HTML paragraphs
  sections, // array of {h2, body (html), analysis (optional), tables (optional)}
  qa, // optional array of {q, a}
  sources, // array of {url, label, desc}
  related, // array of {url, label, desc}
  footerNote
}) {
  const C = {
    tg: 'linear-gradient(135deg,#450a0a 0%,#7f1d1d 100%)',
    tt: '#fca5a5', ti: '#f87171', te: '#e2e8f0',
    h2: '#450a0a', h2b: '#ef4444', h3: '#991b1b', h3b: '#fca5a5',
    bd: '#334155', ib: '#fef2f2', iB: '#ef4444', it: '#991b1b',
    ab: '#fee2e2', aB: '#ef4444', at: '#991b1b',
    thb: '#450a0a', fb: '#450a0a'
  };
  const esc = s => String(s||'');
  let html = `<!-- wp:html -->
<div style="font-family:'Noto Sans KR',sans-serif;max-width:800px;margin:0 auto;color:${C.bd};font-size:16px;line-height:1.9;">
  <div style="background:${C.tg};border-radius:12px;padding:36px 28px;margin-bottom:32px;text-align:center;">
    <p style="color:${C.tt};font-size:13px;margin:0 0 8px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">${esc(eyebrow)}</p>
    <h1 style="color:#fff;font-size:26px;font-weight:800;margin:0 0 12px;line-height:1.4;">${esc(title)}</h1>
    <p style="color:${C.tt};font-size:15px;margin:0;">${esc(subtitle)}</p>
  </div>
  <div style="background:${C.tg};border-radius:12px;padding:28px 28px 24px;margin-bottom:36px;">
    <p style="color:${C.tt};font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">핵심 정리</p>
    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;">
${tldr.map(t=>`      <li style="color:${C.te};font-size:15px;line-height:1.7;padding-left:20px;position:relative;"><span style="position:absolute;left:0;color:${C.ti};font-weight:700;">·</span><strong style="color:${C.ti};">${esc(t.label)}:</strong> ${esc(t.text)}</li>`).join('\n')}
    </ul>
  </div>
  ${intro}
`;
  sections.forEach(s=>{
    html += `
  <h2 style="font-size:28px;font-weight:700;color:${C.h2};border-bottom:3px solid ${C.h2b};padding-bottom:10px;margin-bottom:20px;">${esc(s.h2)}</h2>
  ${s.body}
`;
    if (s.analysis) {
      html += `  <div style="background:${C.ab};border-left:4px solid ${C.aB};border-radius:6px;padding:20px 24px;margin-bottom:32px;"><p style="font-weight:700;color:${C.at};margin:0 0 10px;font-size:15px;">정책 분석</p><p style="font-size:15px;line-height:1.8;color:${C.at};margin:0;font-style:italic;">${s.analysis}</p></div>\n`;
    }
  });
  if (qa && qa.length) {
    html += `  <h2 style="font-size:28px;font-weight:700;color:${C.h2};border-bottom:3px solid ${C.h2b};padding-bottom:10px;margin-bottom:24px;">자주 묻는 질문 Q&amp;A</h2>\n`;
    qa.forEach(q=>{
      html += `  <h3 style="font-size:20px;font-weight:700;color:${C.h3};border-left:4px solid ${C.h3b};padding-left:14px;margin-bottom:12px;">Q. ${esc(q.q)}</h3>
  <div style="background:${C.ib};border-radius:8px;padding:18px 22px;margin-bottom:24px;"><p style="font-size:16px;line-height:1.9;color:${C.bd};margin:0;">A. ${esc(q.a)}</p></div>\n`;
    });
  }
  html += `  <h2 style="font-size:28px;font-weight:700;color:${C.h2};border-bottom:3px solid ${C.h2b};padding-bottom:10px;margin-bottom:20px;">출처</h2>
  <ul style="font-size:16px;line-height:2;color:${C.bd};padding-left:24px;margin-bottom:32px;">
${sources.map(s=>`    <li><a href="${s.url}" style="color:${C.h3};font-weight:600;">${esc(s.label)}</a>${s.desc?' — '+esc(s.desc):''}</li>`).join('\n')}
  </ul>
  <h2 style="font-size:28px;font-weight:700;color:${C.h2};border-bottom:3px solid ${C.h2b};padding-bottom:10px;margin-bottom:20px;">관련 정책</h2>
  <div style="display:grid;gap:12px;margin-bottom:36px;">
${related.map(r=>`    <a href="${r.url}" target="_blank" rel="noopener" style="text-decoration:none;"><div style="background:${C.ab};border:1px solid ${C.aB};border-radius:10px;padding:16px 20px;"><p style="color:${C.h3};font-weight:700;font-size:15px;margin:0 0 4px;">${esc(r.label)}</p><p style="color:#7f1d1d;font-size:13px;margin:0;">${esc(r.desc)}</p></div></a>`).join('\n')}
  </div>
  <p style="font-size:12px;color:#94a3b8;text-align:center;margin-bottom:28px;">${esc(footerNote||'※ 본 내용은 작성 시점 기준이며, 세부 시행령은 관계부처 공고를 확인하세요.')}</p>
  <div style="background:${C.fb};border-radius:10px;padding:20px 24px;text-align:center;"><p style="color:${C.tt};font-size:13px;font-weight:600;margin:0;letter-spacing:1px;">AI Biz Insider · 정책&amp;민생 · aibizinsider.com</p></div>
</div>
<!-- /wp:html -->`;
  return html;
}

module.exports = { buildPolicyPost };
