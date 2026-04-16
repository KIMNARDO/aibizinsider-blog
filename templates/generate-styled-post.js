/**
 * AI Biz Insider - 카테고리별 스타일 포스트 생성기
 * 사용법: node generate-styled-post.js
 *
 * 이 스크립트는 color-system.json의 색상을 기반으로
 * WordPress 블록 에디터용 스타일드 HTML을 생성합니다.
 */

const fs = require('fs');
const colors = JSON.parse(fs.readFileSync(__dirname + '/color-system.json', 'utf8'));

function generateStyledPost(category, sections) {
  const c = colors[category];
  if (!c) throw new Error('Unknown category: ' + category);

  let html = '';

  // TL;DR 박스
  if (sections.tldr) {
    const items = sections.tldr.map(item =>
      `<li>${item.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${c.tldr_highlight}">$1</strong>`)}</li>`
    ).join('\n');

    html += `<!-- wp:group {"style":{"color":{"gradient":"${c.tldr_gradient}"},"border":{"radius":"16px"},"spacing":{"padding":{"top":"32px","bottom":"32px","left":"32px","right":"32px"},"margin":{"bottom":"32px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-background" style="border-radius:16px;background:${c.tldr_gradient};padding-top:32px;padding-right:32px;padding-bottom:32px;padding-left:32px;margin-bottom:32px">
<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"24px","fontWeight":"800"},"color":{"text":"${c.tldr_title_color}"},"spacing":{"margin":{"bottom":"16px"}}}} -->
<h2 class="wp-block-heading has-text-color" style="color:${c.tldr_title_color};font-size:24px;font-weight:800;margin-bottom:16px">${c.pin_label}</h2>
<!-- /wp:heading -->
<!-- wp:list {"style":{"typography":{"fontSize":"15px","lineHeight":"2"},"color":{"text":"${c.tldr_text_color}"}}} -->
<ul class="wp-block-list has-text-color" style="color:${c.tldr_text_color};font-size:15px;line-height:2">
${items}
</ul>
<!-- /wp:list -->
</div>
<!-- /wp:group -->\n\n`;
  }

  // 섹션 반복
  for (const section of sections.content) {
    // H2
    if (section.type === 'h2') {
      html += `<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"28px","fontWeight":"800","lineHeight":"1.3"},"color":{"text":"${c.h2_color}"},"border":{"bottom":{"color":"${c.h2_border}","width":"3px"}},"spacing":{"padding":{"bottom":"12px"},"margin":{"top":"40px","bottom":"20px"}}}} -->
<h2 class="wp-block-heading has-text-color" style="color:${c.h2_color};font-size:28px;font-weight:800;line-height:1.3;border-bottom:3px solid ${c.h2_border};padding-bottom:12px;margin-top:40px;margin-bottom:20px">${section.text}</h2>
<!-- /wp:heading -->\n\n`;
    }

    // H3
    if (section.type === 'h3') {
      html += `<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"20px","fontWeight":"700"},"color":{"text":"${c.h3_color}"},"border":{"left":{"color":"${c.h3_border}","width":"4px"}},"spacing":{"padding":{"left":"12px"},"margin":{"top":"28px","bottom":"16px"}}}} -->
<h3 class="wp-block-heading has-text-color" style="color:${c.h3_color};font-size:20px;font-weight:700;border-left:4px solid ${c.h3_border};padding-left:12px;margin-top:28px;margin-bottom:16px">${section.text}</h3>
<!-- /wp:heading -->\n\n`;
    }

    // 본문 단락
    if (section.type === 'paragraph') {
      html += `<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px","lineHeight":"1.9"},"color":{"text":"${c.body_color}"}}} -->
<p class="has-text-color" style="color:${c.body_color};font-size:16px;line-height:1.9">${section.text}</p>
<!-- /wp:paragraph -->\n\n`;
    }

    // 분석 박스
    if (section.type === 'analysis') {
      html += `<!-- wp:group {"style":{"color":{"background":"${c.analysis_bg}"},"border":{"radius":"12px","left":{"color":"${c.analysis_border}","width":"5px"}},"spacing":{"padding":{"top":"20px","bottom":"20px","left":"24px","right":"24px"},"margin":{"top":"24px","bottom":"24px"}}}} -->
<div class="wp-block-group has-background" style="background-color:${c.analysis_bg};border-radius:12px;border-left:5px solid ${c.analysis_border};padding:20px 24px;margin-top:24px;margin-bottom:24px">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px","lineHeight":"1.8","fontStyle":"italic"},"color":{"text":"${c.analysis_text}"}}} -->
<p class="has-text-color" style="color:${c.analysis_text};font-size:15px;line-height:1.8;font-style:italic"><strong>${c.analysis_label} ―</strong> ${section.text}</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->\n\n`;
    }

    // 구분선
    if (section.type === 'separator') {
      html += `<!-- wp:separator {"style":{"color":{"background":"${c.separator}"}},"className":"is-style-wide"} -->
<hr class="wp-block-separator has-text-color has-alpha-channel-opacity has-background is-style-wide" style="background-color:${c.separator};color:${c.separator}"/>
<!-- /wp:separator -->\n\n`;
    }
  }

  // 관련 글 섹션
  if (sections.related && sections.related.length > 0) {
    html += `<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"28px","fontWeight":"800","lineHeight":"1.3"},"color":{"text":"${c.h2_color}"},"border":{"bottom":{"color":"${c.h2_border}","width":"3px"}},"spacing":{"padding":{"bottom":"12px"},"margin":{"top":"40px","bottom":"20px"}}}} -->
<h2 class="wp-block-heading has-text-color" style="color:${c.h2_color};font-size:28px;font-weight:800;line-height:1.3;border-bottom:3px solid ${c.h2_border};padding-bottom:12px;margin-top:40px;margin-bottom:20px">${c.related_label}</h2>
<!-- /wp:heading -->\n\n`;

    const relItems = sections.related.map(r =>
      `<li><a href="${r.url}" style="color:${c.h2_border};text-decoration:none;font-weight:600">${r.title}</a></li>`
    ).join('\n');

    html += `<!-- wp:list {"style":{"typography":{"fontSize":"15px","lineHeight":"2.2"},"color":{"text":"${c.body_color}"}}} -->
<ul class="wp-block-list has-text-color" style="color:${c.body_color};font-size:15px;line-height:2.2">
${relItems}
</ul>
<!-- /wp:list -->\n\n`;
  }

  // 출처 섹션
  if (sections.sources && sections.sources.length > 0) {
    html += `<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"28px","fontWeight":"800","lineHeight":"1.3"},"color":{"text":"${c.h2_color}"},"border":{"bottom":{"color":"${c.h2_border}","width":"3px"}},"spacing":{"padding":{"bottom":"12px"},"margin":{"top":"40px","bottom":"20px"}}}} -->
<h2 class="wp-block-heading has-text-color" style="color:${c.h2_color};font-size:28px;font-weight:800;line-height:1.3;border-bottom:3px solid ${c.h2_border};padding-bottom:12px;margin-top:40px;margin-bottom:20px">${c.source_label}</h2>
<!-- /wp:heading -->\n\n`;

    const srcItems = sections.sources.map((s, i) =>
      `<li><a href="${s.url}" target="_blank" rel="noopener" style="color:${c.h3_color}">${s.title}</a></li>`
    ).join('\n');

    html += `<!-- wp:list {"ordered":true,"style":{"typography":{"fontSize":"14px","lineHeight":"2"},"color":{"text":"#64748b"}}} -->
<ol class="wp-block-list has-text-color" style="color:#64748b;font-size:14px;line-height:2">
${srcItems}
</ol>
<!-- /wp:list -->\n\n`;
  }

  // 푸터
  html += `<!-- wp:group {"style":{"color":{"background":"${c.footer_bg}"},"border":{"radius":"12px"},"spacing":{"padding":{"top":"20px","bottom":"20px","left":"28px","right":"28px"},"margin":{"top":"32px"}}}} -->
<div class="wp-block-group has-background" style="background-color:${c.footer_bg};border-radius:12px;padding:20px 28px;margin-top:32px">
<!-- wp:paragraph {"align":"center","style":{"color":{"text":"#64748b"},"typography":{"fontSize":"13px"}}} -->
<p class="has-text-align-center has-text-color" style="color:#64748b;font-size:13px">AI Biz Insider · ${c.name} · aibizinsider.com</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`;

  return html;
}

// Export for use
module.exports = { generateStyledPost, colors };

console.log('✅ 카테고리별 스타일 생성기 준비 완료');
console.log('카테고리:', Object.keys(colors).join(', '));
