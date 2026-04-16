const fs = require('fs');
const path = require('path');
const { buildPolicyPost } = require('./policy_batch_builder.js');

const P = (html) => `<p style="font-size:16px;line-height:1.9;color:#334155;margin-bottom:20px;">${html}</p>`;

const posts = {};

// --- 552: 고유가 피해지원금 완전 정리 ---
posts[552] = {
  title: '2026 고유가 피해지원금 완전 정리 — 대상·금액·신청 방법·지급일 한눈에 보기',
  content: buildPolicyPost({
    eyebrow: '2026 정부 추경 정책',
    title: '2026 고유가 피해지원금, 얼마나 받을 수 있나',
    subtitle: '소득 하위 70% 약 3,577만 명 · 최대 60만 원 · 2026년 4~7월 지급',
    tldr: [
      { label: '대상', text: '건강보험료 기준 소득 하위 70% (약 3,577만 명)' },
      { label: '금액', text: '지역·계층별 10만~60만 원 차등' },
      { label: '1차 지급', text: '2026년 4월 말 (기초수급자 등 자동지급)' },
      { label: '2차 지급', text: '2026년 6~7월 일반 가구 신청 후 순차 지급' },
      { label: '사용처', text: '지역화폐, 대형마트·온라인몰 사용 불가' }
    ],
    intro: P('오늘(4월 10일) 국회 본회의에서 2026년 제1차 추가경정예산안이 처리될 예정입니다. 이번 추경의 핵심은 <strong>고유가 피해지원금</strong>으로, 중동 정세 불안으로 국제유가가 급등한 상황에서 정부가 소득 하위 70% 국민에게 최대 60만 원을 지역화폐로 지급합니다.'),
    sections: [
      {
        h2: '지원 대상 — 소득 하위 70% 기준',
        body: P('지원 대상은 <strong>건강보험료 기준 소득 하위 70%</strong>입니다. 가구원수별 직장보험료 기준은 1인 약 14만 원, 2인 약 23만 원, 3인 약 29만 원, 4인 약 35만 원 이하입니다.') +
        `<div style="background:#fee2e2;border:2px solid #ef4444;border-radius:10px;padding:20px;margin-bottom:28px;"><table style="width:100%;border-collapse:collapse;font-size:15px;"><thead><tr style="background:#450a0a;"><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">가구원수</th><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">월소득 기준</th><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">직장보험료</th></tr></thead><tbody>
        <tr><td style="padding:9px;border:1px solid #fca5a5;color:#991b1b;">1인</td><td style="padding:9px;border:1px solid #fca5a5;">약 385만 원</td><td style="padding:9px;border:1px solid #fca5a5;">약 14만 원</td></tr>
        <tr><td style="padding:9px;border:1px solid #fca5a5;color:#991b1b;">2인</td><td style="padding:9px;border:1px solid #fca5a5;">약 630만 원</td><td style="padding:9px;border:1px solid #fca5a5;">약 23만 원</td></tr>
        <tr><td style="padding:9px;border:1px solid #fca5a5;color:#991b1b;">3인</td><td style="padding:9px;border:1px solid #fca5a5;">약 804만 원</td><td style="padding:9px;border:1px solid #fca5a5;">약 29만 원</td></tr>
        <tr><td style="padding:9px;border:1px solid #fca5a5;color:#991b1b;">4인</td><td style="padding:9px;border:1px solid #fca5a5;">약 974만 원</td><td style="padding:9px;border:1px solid #fca5a5;">약 35만 원</td></tr>
        </tbody></table></div>`
      },
      {
        h2: '지급 금액 — 계층·지역별 차등',
        body: P('계층·지역별로 차등 지급됩니다. 기초생활수급자·한부모 최대 <strong>60만 원</strong>, 차상위계층 <strong>50만 원</strong>, 인구감소 특별지역 <strong>25만 원</strong>, 수도권 일반 가구 <strong>10만 원</strong>입니다. 비수도권 15만 원, 인구감소 우대지역 20만 원이 추가됩니다.'),
        analysis: '유가 급등으로 인한 서민 생활비 부담을 선별 지급 방식으로 완화합니다. 2025년 전 국민 소비쿠폰과 달리 계층·지역 가중치가 적용되어 취약계층 실효성을 높인 것이 특징입니다.'
      },
      {
        h2: '지급 일정 — 1차·2차 분할',
        body: P('<strong>1차(4월 말)</strong>: 기초수급자·차상위·한부모 약 321만 명 자동 지급. <strong>2차(6월 말~7월 초)</strong>: 소득 하위 70% 일반 가구 약 3,256만 명, 건강보험료 산정 후 온라인·방문 신청.')
      },
      {
        h2: '사용처 안내',
        body: P('지역사랑상품권 또는 신용·체크카드 포인트 충전 형태로 지급됩니다. <strong>사용 제한 업종</strong>: 대형마트(이마트·홈플러스·코스트코), 백화점·면세점, 유흥업소·사행산업, 온라인 쇼핑몰(쿠팡·네이버).')
      }
    ],
    qa: [
      { q: '직장인인데 연봉이 높아도 받을 수 있나요?', a: '건강보험료 기준으로 판정하므로 4인 가구 기준 직장보험료 약 35만 원 이하면 대상입니다. 맞벌이는 합산 보험료로 판단하므로 건강보험공단 홈페이지에서 직접 조회해 보세요.' },
      { q: '추경 통과 후 언제 신청할 수 있나요?', a: '추경 통과 후 약 2주 내 정부 공식 시행 공고가 발표됩니다. 1차는 4월 말 자동 지급, 일반 가구 신청은 5~6월 중 정부24·복지로·지자체 누리집에서 열립니다.' }
    ],
    sources: [
      { url: 'https://www.gov.kr', label: '정부24 (gov.kr)', desc: '지원금 신청·조회' },
      { url: 'https://www.bokjiro.go.kr', label: '복지로 (bokjiro.go.kr)', desc: '복지서비스 통합 신청' },
      { url: 'https://www.nhis.or.kr', label: '국민건강보험공단 (nhis.or.kr)', desc: '건강보험료 조회' },
      { url: 'https://www.mois.go.kr', label: '행정안전부 (mois.go.kr)', desc: '공식 시행 공고 확인' },
      { url: 'https://www.korea.kr', label: '대한민국 정책브리핑 (korea.kr)', desc: '추경 최신 뉴스' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/08/2026-fuel-subsidy-application-guide/', label: '2026 고유가 피해지원금 신청 가이드', desc: '소득 하위 70% 대상·지급일정·건강보험료 기준' },
      { url: 'https://aibizinsider.com/2026/04/05/2026-oil-price-relief-fund-guide/', label: '2026 고유가 피해지원금 총정리', desc: '최대 60만원 차등 지급 일정과 신청 방법' },
      { url: 'https://aibizinsider.com/2026/04/08/public-vehicle-odd-even-day-2026-april/', label: '공공기관 차량 2부제 시행 총정리', desc: '공영주차장 5부제와 민간 차량 영향' }
    ],
    footerNote: '※ 본 내용은 2026년 4월 10일 기준이며, 추경 통과 후 정부 공식 공고를 확인하시기 바랍니다.'
  })
};

// --- 549: 국세청 부동산 탈세 제보 포상금 ---
posts[549] = {
  title: '국세청, 부동산 탈세 제보 포상금 최대 40억 도입 — 6개월 만에 780건 제보',
  content: buildPolicyPost({
    eyebrow: '정책 · 민생 브리핑 · 2026.04.09',
    title: '국세청, 부동산 탈세 제보 포상금 최대 40억 도입',
    subtitle: '2025년 10월 신고센터 개설 후 6개월 만에 780건 접수',
    tldr: [
      { label: '상한선', text: '부동산 탈세 제보 포상금 최대 40억 원' },
      { label: '접수 현황', text: '2025년 10월~2026년 3월 누적 780건' },
      { label: '지급률', text: '탈루세액 5,000만 원 초과 시 기본 20%' },
      { label: '제보자 보호', text: '신원 비밀 보장 및 무관용 원칙 재확인' }
    ],
    intro: P('국세청이 부동산 탈세 근절을 위해 포상금 상한을 <strong>최대 40억 원</strong>으로 대폭 확대했습니다. 2025년 10월 개설한 부동산 탈세 신고센터에는 2026년 3월 말까지 780건이 접수됐고, 상당수가 양도소득세·취득세 누락 유형입니다.'),
    sections: [
      {
        h2: '포상금 지급 구조',
        body: `<div style="background:#fee2e2;border:2px solid #ef4444;border-radius:10px;padding:20px;margin-bottom:28px;"><table style="width:100%;border-collapse:collapse;font-size:15px;"><thead><tr style="background:#450a0a;"><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">탈루세액 구간</th><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">지급률 / 산식</th><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">비고</th></tr></thead><tbody>
        <tr><td style="padding:9px;border:1px solid #fca5a5;">5,000만 원 초과</td><td style="padding:9px;border:1px solid #fca5a5;">탈루세액의 20%</td><td style="padding:9px;border:1px solid #fca5a5;">기본 지급률</td></tr>
        <tr><td style="padding:9px;border:1px solid #fca5a5;">30억 원 초과</td><td style="padding:9px;border:1px solid #fca5a5;">4.25억 + 초과분의 5%</td><td style="padding:9px;border:1px solid #fca5a5;">상한 40억 원</td></tr>
        </tbody></table></div>`
      },
      {
        h2: '주요 적발 사례',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>자경 농지 감면 악용</strong> — 양도세 감면을 받고 실제로는 농사를 짓지 않은 사례</li>
        <li><strong>계약금 몰취 소득 누락</strong> — 매매 해제 후 몰취 계약금을 소득에 반영하지 않은 사례</li>
        <li><strong>별도 보상금 누락</strong> — 토지 매매 시 받은 별도 보상금을 양도세 신고에서 빠뜨린 사례</li>
        </ul>`,
        analysis: '40억 상한은 대형 기획 탈세 내부자를 겨냥한 신호입니다. 국세청이 축적한 금융·등기·거래 데이터와 제보 정보를 결합해 적발 정확도를 끌어올리는 데이터 기반 행정의 연장선입니다.'
      },
      {
        h2: '유의 사항',
        body: `<div style="background:#fee2e2;border:2px solid #ef4444;border-radius:8px;padding:20px;margin-bottom:28px;"><p style="font-weight:700;color:#991b1b;margin:0 0 10px;">꼭 확인하세요</p><p style="font-size:15px;color:#991b1b;margin:0;line-height:1.8;">포상금은 실제 추징 세액 확정 후 지급됩니다. '제보 즉시 40억'이 아니며, 근거 없는 악의적 제보는 무고·명예훼손 책임이 따를 수 있습니다. 제보 전 사실관계·객관 자료 확보가 필수입니다.</p></div>`
      }
    ],
    sources: [
      { url: 'https://www.nts.go.kr', label: '국세청 (nts.go.kr)', desc: '부동산 탈세 신고센터' },
      { url: 'https://www.hometax.go.kr', label: '홈택스 (hometax.go.kr)', desc: '온라인 탈세 제보' },
      { url: 'https://newshotline.kr/ViewM.aspx?No=4035889', label: '뉴스핫라인 원문 기사 (2026-04-09)', desc: '박영훈 기자' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/03/30/hometax-faq-top-5-fixes/', label: '홈택스 FAQ BEST 5와 해결 방법', desc: '오류 대처부터 민원까지' },
      { url: 'https://aibizinsider.com/2026/04/07/2026-april-health-insurance-year-end-settlement-automation/', label: '2026년 4월 건강보험료 연말정산 자동화', desc: '추가납부·환급·분할납부 안내' }
    ]
  })
};

// --- 541: 청년 월세 지원 ---
posts[541] = {
  title: '2026 청년 월세 지원 신청 가이드 — 청약통장 폐지·최대 480만 원·5월 29일 마감',
  content: buildPolicyPost({
    eyebrow: '2026 국토교통부 청년 주거지원',
    title: '2026 청년 월세 지원 신청 완전 가이드',
    subtitle: '만 19~34세 · 최대 480만 원 · 신청 5월 29일까지',
    tldr: [
      { label: '대상', text: '만 19~34세 무주택 청년, 기준 중위소득 60% 이하' },
      { label: '지원 금액', text: '월 최대 20만 원 × 최대 24개월 = 총 480만 원' },
      { label: '신청 기간', text: '2026년 3월 30일 ~ 5월 29일 16:00' },
      { label: '달라진 점', text: '청약통장 요건 폐지, 상시 신청 제도 전환' },
      { label: '임차 조건', text: '보증금 5천만 원 이하, 월세 60만 원 이하' }
    ],
    intro: P('올해부터 <strong>청약통장 요건이 폐지</strong>되고 상시 신청도 가능해졌습니다. 2026년 신규 신청 기간은 3월 30일부터 5월 29일 오후 4시까지입니다.'),
    sections: [
      {
        h2: '2026년, 뭐가 달라졌나요?',
        body: P('<strong>① 청약통장 요건 완전 폐지</strong> — 이전까지 청약통장 가입이 필수였으나, 2026년부터는 누구나 신청할 수 있습니다.') +
        P('<strong>② 상시 신청 제도 전환</strong> — 기존 1·2차 모집 기간이 사라지고 1년 내내 신청 가능해졌습니다. 단, 2026년 신규 신청은 3월 30일~5월 29일.')
      },
      {
        h2: '신청 자격',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>나이</strong>: 만 19~34세 (신청일 기준)</li>
        <li><strong>주거</strong>: 독립 거주 무주택 청년, 임대차계약 보유</li>
        <li><strong>청년 가구 소득</strong>: 기준 중위소득 60% 이하 (1인 월 약 143만 원)</li>
        <li><strong>원가구 소득</strong>: 기준 중위소득 100% 이하 (1인 월 약 239만 원)</li>
        <li><strong>임차 조건</strong>: 보증금 5천만 원 이하 + 월세 60만 원 이하</li>
        </ul>`
      },
      {
        h2: '신청 절차 4단계',
        body: `<ol style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>소득 요건 사전 확인</strong> — 복지로 모의계산</li>
        <li><strong>서류 준비</strong> — 임대차계약서, 가족관계증명서, 건강보험료 납부확인서</li>
        <li><strong>온라인·방문 신청</strong> — 복지로 또는 주민센터 (청년 본인)</li>
        <li><strong>결과 통보·지급</strong> — 매월 월세 납부 확인 후 입금</li>
        </ol>`,
        analysis: '청약통장 진입 장벽을 완전히 없애고 상시 신청을 도입한 것은 청년 주거비 부담 완화의 실질적 확대 조치입니다. 대학생·아르바이트생까지 실질 수혜 범위를 넓힌 것이 핵심 변화입니다.'
      }
    ],
    qa: [
      { q: '부모님 집에서 독립한 지 얼마 안 됐는데 신청 가능한가요?', a: '네, 가능합니다. 독립 거주 기간 최소 요건은 없습니다. 실제 독립 거주·임대차계약이 있으면 신청할 수 있고, 부모님(원가구) 소득이 기준 중위소득 100% 이하여야 합니다.' },
      { q: '대학생도 받을 수 있나요?', a: '대학생도 만 19~34세·독립 거주면 신청 대상입니다. 아르바이트 수입이 있어도 청년 가구 소득이 중위 60% 이하면 가능하며, 2026년부터 청약통장 요건도 사라졌습니다.' },
      { q: '\'생애 1회\'란 무슨 의미인가요?', a: '평생 한 번만 받을 수 있습니다. 매달 월세 납부 확인 후 입금되며, 중도 중단 후 재개는 24개월 이내라면 가능하지만 한 번 종료되면 재신청은 불가합니다.' }
    ],
    sources: [
      { url: 'https://www.bokjiro.go.kr', label: '복지로 (bokjiro.go.kr)', desc: '청년 월세 지원 온라인 신청·모의계산' },
      { url: 'https://www.molit.go.kr', label: '국토교통부 (molit.go.kr)', desc: '청년 주거지원 정책 소관 부처' },
      { url: 'https://youth.seoul.go.kr', label: '서울시 청년몽땅정보통', desc: '서울 청년 정책 통합' },
      { url: 'https://www.gov.kr', label: '정부24 (gov.kr)', desc: '민원·지원금 통합 포털' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/06/2026-youth-rent-support-permanent/', label: '2026 청년월세지원 상시화 총정리', desc: '월 20만 원, 최대 480만 원' },
      { url: 'https://aibizinsider.com/2026/03/31/youth-rent-support-2026-guide/', label: '2026 청년월세지원 달라진 점 총정리', desc: '상시신청 전환 해설' }
    ]
  })
};

// --- 528: 고유가 피해지원금 신청 가이드 ---
posts[528] = {
  title: '2026 고유가 피해지원금 신청 완전 가이드 — 소득 하위 70% 대상·지급일정·건강보험료 기준 총정리',
  content: buildPolicyPost({
    eyebrow: '2026 정부 추경 핵심 정책',
    title: '2026 고유가 피해지원금 신청 완전 가이드',
    subtitle: '소득 하위 70% · 1인 최대 60만 원 · 지급일정 총정리',
    tldr: [
      { label: '규모', text: '4조 8,000억 원 추경, 소득 하위 70% 약 3,257만 명' },
      { label: '금액', text: '1인당 10만~60만 원 차등 지급' },
      { label: '1차(4월 중순~말)', text: '기초수급자·차상위 자동 지급, 신청 불필요' },
      { label: '2차(5~6월)', text: '일반 국민 정부24·복지로·주민센터 신청' },
      { label: '판정 기준', text: '건강보험료 기준 소득 하위 70%' }
    ],
    intro: P('국회 본회의 통과 후 <strong>4조 8,000억 원 규모</strong>로 지급됩니다. 기초생활수급자는 별도 신청 없이 4월 중순부터 자동 지급됩니다.'),
    sections: [
      {
        h2: '지급 타임라인 4단계',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>3월 31일</strong> — 정부, 추경안 발표 (4.8조, 소득 하위 70%)</li>
        <li><strong>4월 10일(예정)</strong> — 국회 본회의 추경 통과</li>
        <li><strong>4월 중순~말</strong> — 취약계층 우선 자동 지급 (기초·차상위)</li>
        <li><strong>5~6월</strong> — 일반 국민 신청·순차 지급 (건보료 기준)</li>
        </ul>`
      },
      {
        h2: '지급 금액·건강보험료 기준',
        body: P('1인당 <strong>10만~60만 원</strong>, 가구 소득에 따라 차등 지급됩니다. 건강보험료 기준은 1인 약 385만 원, 2인 약 630만 원, 3인 약 800만 원 이하 수준입니다.'),
        analysis: '2025년 전 국민 소비쿠폰과 달리 선별 지급 방식으로, 건보료 기반 판정을 통해 취약계층에 집중 지원하는 구조입니다.'
      },
      {
        h2: '나는 받을 수 있을까? 체크리스트',
        body: `<div style="background:#fee2e2;border:2px solid #ef4444;border-radius:10px;padding:20px;margin-bottom:28px;">
        <p style="margin:0 0 8px;color:#7f1d1d;">☑ 기초생활수급자·차상위계층이면 <strong>자동 지급</strong></p>
        <p style="margin:0 0 8px;color:#7f1d1d;">☑ 가구 건강보험료가 기준 이하면 <strong>신청 대상</strong></p>
        <p style="margin:0 0 8px;color:#7f1d1d;">☑ 대한민국 거주 내국인 가구원</p>
        <p style="margin:0;color:#7f1d1d;">☑ 국회 통과 후 정부24·복지로·주민센터 신청</p>
        </div>`
      }
    ],
    qa: [
      { q: '직장에 다니는데도 받을 수 있나요?', a: '네. 직장가입자도 건강보험료 기준 소득 하위 70%에 해당하면 지원 대상입니다.' },
      { q: '추경이 통과되지 않으면 어떻게 되나요?', a: '국회 본회의 추경 통과가 법적 근거이며, 통과 전에는 지급되지 않습니다. 4월 10일 본회의 처리를 목표로 심의 중입니다.' }
    ],
    sources: [
      { url: 'https://www.gov.kr', label: '정부24', desc: '지원금 통합 신청 채널' },
      { url: 'https://www.bokjiro.go.kr', label: '복지로', desc: '취약계층 자격 조회·신청' },
      { url: 'https://www.korea.kr', label: '대한민국 정책브리핑', desc: '추경 공식 발표' },
      { url: 'https://www.nhis.or.kr', label: '국민건강보험공단', desc: '건강보험료 조회' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/10/2026-fuel-subsidy-guide-korea/', label: '2026 고유가 피해지원금 완전 정리', desc: '대상·금액·신청·지급일 한눈에' },
      { url: 'https://aibizinsider.com/2026/04/05/2026-oil-price-relief-fund-guide/', label: '2026 고유가 피해지원금 총정리', desc: '소득 하위 70% 차등 지급' },
      { url: 'https://aibizinsider.com/2026/04/08/public-vehicle-odd-even-day-2026-april/', label: '공공기관 차량 2부제 시행', desc: '공영주차장 5부제와 민간 영향' }
    ]
  })
};

// --- 527: 공공기관 차량 2부제 ---
posts[527] = {
  title: '공공기관 차량 2부제 4월 8일 시행 총정리 — 공영주차장 5부제와 민간 차량 영향',
  content: buildPolicyPost({
    eyebrow: '정부 정책 · 2026.04.08 시행',
    title: '공공기관 차량 2부제·공영주차장 5부제 총정리',
    subtitle: '홀짝제 운영 방식과 민간 차량 영향까지',
    tldr: [
      { label: '주관', text: '기후에너지환경부 (장관 김성환)' },
      { label: '시행일', text: '2026년 4월 8일(수) 0시부터' },
      { label: '대상', text: '중앙행정·지자체·공공기관 보유·임차 승용차' },
      { label: '규칙', text: '2부제(홀짝제) + 공영주차장 5부제(요일제)' },
      { label: '민간', text: '의무 제한 없음, 공영주차장 이용 시 5부제 적용' }
    ],
    intro: P('2026년 4월 8일 0시부터 <strong>공공기관 차량 2부제(홀짝제)</strong>와 <strong>공영주차장 5부제(요일제)</strong>가 동시에 시행됩니다. 중동 정세 불안에 따른 국제유가 대응 조치입니다.'),
    sections: [
      {
        h2: '2부제와 5부제, 무엇이 다른가',
        body: `<div style="background:#fee2e2;border:2px solid #ef4444;border-radius:10px;padding:20px;margin-bottom:28px;"><table style="width:100%;border-collapse:collapse;font-size:15px;"><thead><tr style="background:#450a0a;"><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">구분</th><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">공공기관 2부제</th><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">공영주차장 5부제</th></tr></thead><tbody>
        <tr><td style="padding:9px;border:1px solid #fca5a5;"><strong>대상</strong></td><td style="padding:9px;border:1px solid #fca5a5;">공공기관 승용차</td><td style="padding:9px;border:1px solid #fca5a5;">공영주차장 이용 모든 차량</td></tr>
        <tr><td style="padding:9px;border:1px solid #fca5a5;"><strong>기준</strong></td><td style="padding:9px;border:1px solid #fca5a5;">끝자리 홀·짝</td><td style="padding:9px;border:1px solid #fca5a5;">끝자리 0~9 요일 매칭</td></tr>
        <tr><td style="padding:9px;border:1px solid #fca5a5;"><strong>제한</strong></td><td style="padding:9px;border:1px solid #fca5a5;">월 약 15일</td><td style="padding:9px;border:1px solid #fca5a5;">월 약 4일</td></tr>
        <tr><td style="padding:9px;border:1px solid #fca5a5;"><strong>예외</strong></td><td style="padding:9px;border:1px solid #fca5a5;">응급·작전·장애인·친환경차</td><td style="padding:9px;border:1px solid #fca5a5;">정기권·환승·무료 주차장</td></tr>
        </tbody></table></div>`
      },
      {
        h2: '공영주차장 5부제 요일 기준',
        body: P('월요일 1·6, 화요일 2·7, 수요일 3·8, 목요일 4·9, 금요일 5·0. 토·일 제한 없음. 본인 차량 끝번호 해당 요일에는 공영주차장 출입이 제한됩니다.'),
        analysis: '이번 조치는 1단계로 운영되며, 국제유가가 일정 수준 이상 지속될 경우 민간 차량 5부제 의무화 단계로 확대될 가능성이 있습니다. 자가용 출퇴근자는 대중교통·카풀 옵션을 미리 점검하는 것이 합리적입니다.'
      },
      {
        h2: '민간 차량 대응 체크리스트',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li>☐ 내 차량 끝번호 확인</li>
        <li>☐ 해당 요일 공영주차장 출입 제한 확인</li>
        <li>☐ 직장·자녀학교 인근 사설주차장 위치 조사</li>
        <li>☐ 환승주차장(P&amp;R) 위치·운영시간 확인</li>
        <li>☐ 친환경차·카풀·자전거 등 대안 검토</li>
        <li>☐ 거주 지자체 공지 주 1회 확인</li>
        </ul>`
      }
    ],
    qa: [
      { q: '민간 차량도 의무적으로 2부제를 지켜야 하나요?', a: '아닙니다. 의무 2부제는 공공기관 차량만 적용됩니다. 민간은 자율 5부제 동참 권고이나, 공영주차장 이용 시 5부제 기준을 지켜야 합니다.' },
      { q: '전기차·수소차도 대상인가요?', a: '친환경차는 2부제·5부제 모두 예외입니다. 환경친화적 자동차 증명서를 함께 휴대하는 것이 안전합니다.' },
      { q: '무료 공영주차장·환승주차장은 적용 제외인가요?', a: '기후에너지환경부 기준 무료 공영주차장·대중교통 환승주차장은 5부제 예외입니다. 단, 지자체별 자체 지침이 있을 수 있으니 이용 전 공지를 확인하세요.' }
    ],
    sources: [
      { url: 'https://www.korea.kr/news/policyNewsView.do?newsId=148961891', label: '정책브리핑 — 공공기관 차량 2부제 시행', desc: '공식 안내' },
      { url: 'https://www.korea.kr/briefing/pressReleaseView.do?newsId=156752416', label: '기후에너지환경부 보도자료', desc: '민간 자율 5부제 안내' },
      { url: 'https://www.me.go.kr', label: '환경부 (me.go.kr)', desc: '친환경차 인증' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/10/2026-fuel-subsidy-guide-korea/', label: '2026 고유가 피해지원금 완전 정리', desc: '최대 60만 원 차등 지급' },
      { url: 'https://aibizinsider.com/2026/04/08/2026-fuel-subsidy-application-guide/', label: '2026 고유가 피해지원금 신청 가이드', desc: '지급일정·건강보험료 기준' }
    ]
  })
};

// --- 501: 건강보험료 연말정산 자동화 ---
posts[501] = {
  title: '2026년 4월 직장가입자 건강보험료 연말정산 자동화 확대 총정리 — 추가납부·환급·분할납부 한눈에',
  content: buildPolicyPost({
    eyebrow: '정부 정책 · 2026.04.16 시행',
    title: '2026년 4월 직장가입자 건강보험료 연말정산 자동화 확대',
    subtitle: '신고 부담은 줄이고, 환급·추가납부 처리는 더 빠르게',
    tldr: [
      { label: '발표 기관', text: '행정안전부·국민건강보험공단' },
      { label: '시행일', text: '2026년 4월 16일' },
      { label: '대상', text: '전국 모든 직장가입자·사업장' },
      { label: '핵심 변화', text: '국세청 자료 연계 자동 정산 확대' },
      { label: '분할납부', text: '1개월 보험료 초과 시 최대 12회 분할' }
    ],
    intro: P('2026년 4월 16일부터 직장가입자 건강보험료 연말정산 절차가 <strong>자동화 방식으로 확대</strong>됩니다. 사업장이 별도 보수총액 신고를 하지 않아도, 국세청 근로소득 자료 기반으로 공단이 자동 정산합니다.'),
    sections: [
      {
        h2: '무엇이 달라지나 (기존 vs 변경)',
        body: `<div style="background:#fee2e2;border:2px solid #ef4444;border-radius:10px;padding:20px;margin-bottom:28px;"><table style="width:100%;border-collapse:collapse;font-size:15px;"><thead><tr style="background:#450a0a;"><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">구분</th><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">기존</th><th style="padding:10px;color:#fca5a5;border:1px solid #7f1d1d;">변경(4/16~)</th></tr></thead><tbody>
        <tr><td style="padding:9px;border:1px solid #fca5a5;">사업장 보수총액 신고</td><td style="padding:9px;border:1px solid #fca5a5;">3월 10일 신고서 제출</td><td style="padding:9px;border:1px solid #fca5a5;">국세청 자료 자동 처리</td></tr>
        <tr><td style="padding:9px;border:1px solid #fca5a5;">정산 결과 통지</td><td style="padding:9px;border:1px solid #fca5a5;">4월 급여 후 안내</td><td style="padding:9px;border:1px solid #fca5a5;">자동 산정·모바일 안내 강화</td></tr>
        <tr><td style="padding:9px;border:1px solid #fca5a5;">추가납부 분할</td><td style="padding:9px;border:1px solid #fca5a5;">최대 12회</td><td style="padding:9px;border:1px solid #fca5a5;">최대 12회 유지</td></tr>
        <tr><td style="padding:9px;border:1px solid #fca5a5;">환급 처리</td><td style="padding:9px;border:1px solid #fca5a5;">4월분 자동 차감</td><td style="padding:9px;border:1px solid #fca5a5;">자동 차감(속도 개선)</td></tr>
        </tbody></table></div>`
      },
      {
        h2: '추가납부 vs 환급',
        body: P('작년 보수가 늘었으면 <strong>추가납부</strong>, 줄었으면 <strong>환급</strong>입니다. 통계상 추가납부 대상 약 1,000만 명(1인 평균 약 20만 원대), 환급 대상 약 350만 명(1인 평균 약 11만 원대)입니다. 모두 4월 급여에 자동 반영됩니다.'),
        analysis: '이번 자동화는 단순 편의 개선을 넘어 국세청·공단·고용부 간 데이터 공유 강화로, 향후 4대보험 통합 신고 흐름의 기반입니다. 영세 사업장 3월 신고 부담이 크게 줄어듭니다.'
      },
      {
        h2: '신청 방법·분할납부',
        body: `<ol style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li>자동 정산 결과 확인 (4월 급여명세서 / The건강보험 앱)</li>
        <li>추가납부 분할 신청 (앱·홈페이지·1577-1000·지사)</li>
        <li>환급금 자동 차감 (별도 신청 불필요)</li>
        <li>사업장 확인(비과세·입퇴사자)</li>
        <li>이의신청 (통지일 90일 이내)</li>
        </ol>`
      }
    ],
    qa: [
      { q: '자동화가 확대되면 제가 따로 신청해야 하나요?', a: '별도 신청은 없습니다. 4월분 급여명세서에 자동 반영됩니다. 분할납부 원할 경우에만 The건강보험 앱·1577-1000으로 직접 신청하면 됩니다.' },
      { q: '4월에 갑자기 월급이 줄었어요. 무엇을 확인해야 하나요?', a: '급여명세서의 \'건강보험료 연말정산\' 항목을 확인하세요. 작년 보수가 늘었다면 추가 납부 때문입니다. 1개월분 초과 시 최대 12개월 분할 신청이 가능합니다.' },
      { q: '이직·휴직한 경우에도 자동화가 적용되나요?', a: '적용되지만 입·퇴사 정산·무보수 휴직 등 특수 케이스는 사업장 확인이 필요할 수 있습니다. 결과에 이의가 있으면 90일 이내 이의신청이 가능합니다.' }
    ],
    sources: [
      { url: 'https://www.korea.kr/news/policyNewsView.do?newsId=148961922', label: '정책브리핑 — 4~5월 혁신행정 시행 안내', desc: '공식 발표' },
      { url: 'https://www.nhis.or.kr/nhis/index.do', label: '국민건강보험공단', desc: '보험료 조회·분할납부' },
      { url: 'https://www.nhis.or.kr/nhis/policy/wbhada01000m01.do', label: '직장가입자 보험료 안내', desc: '정책 상세' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/06/2026-youth-rent-support-permanent/', label: '2026 청년월세지원 상시화 총정리', desc: '월 20만 원·480만 원' },
      { url: 'https://aibizinsider.com/2026/04/10/2026-fuel-subsidy-guide-korea/', label: '2026 고유가 피해지원금 완전 정리', desc: '최대 60만 원 차등 지급' }
    ]
  })
};

// --- 487: 청년월세지원 상시화 ---
posts[487] = {
  title: '2026년 청년월세지원 상시화 총정리 — 월 20만 원, 최대 24개월 480만 원과 주거급여 인상 현황',
  content: buildPolicyPost({
    eyebrow: '국토교통부 청년 주거 정책',
    title: '2026년 청년월세지원 상시화 총정리',
    subtitle: '월 20만 원 × 24개월 = 최대 480만 원, 생애 1회',
    tldr: [
      { label: '핵심 변화', text: '상시 신청 제도 전환 (연중 가능)' },
      { label: '대상', text: '만 19~34세 무주택 청년, 중위소득 60% 이하' },
      { label: '지원', text: '월 최대 20만 원 × 최대 24개월 (생애 1회)' },
      { label: '임차 조건', text: '보증금 5천만 원·월세 60만 원 이하' },
      { label: '주거급여', text: '2026년 주거급여 기준임대료 인상 병행' }
    ],
    intro: P('2026년부터 청년월세지원이 <strong>상시 신청 제도</strong>로 전환되었습니다. 청약통장 요건이 폐지되고, 1년 내내 신청할 수 있게 바뀐 것이 핵심입니다.'),
    sections: [
      {
        h2: '상시 신청, 어떻게 달라졌나',
        body: P('기존에는 1·2차 모집 기간에만 신청할 수 있었지만, 2026년부터 <strong>연중 상시 신청</strong>으로 변경되었습니다. 청약통장 요건도 완전히 폐지되어 진입 장벽이 크게 낮아졌습니다.'),
        analysis: '제도의 상시화는 돌발적 주거비 부담 상황에도 즉시 대응할 수 있도록 설계 변경된 조치입니다. 복지 정책이 점차 상시·맞춤형으로 전환되는 흐름을 상징합니다.'
      },
      {
        h2: '지원 대상과 금액',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>나이</strong>: 만 19~34세 독립 거주 청년</li>
        <li><strong>소득</strong>: 청년 본인 중위 60%, 원가구 중위 100% 이하</li>
        <li><strong>임차</strong>: 보증금 5천만 원 이하 + 월세 60만 원 이하</li>
        <li><strong>금액</strong>: 월 최대 20만 원 × 최대 24개월 = 480만 원</li>
        <li><strong>횟수</strong>: 생애 1회</li>
        </ul>`
      },
      {
        h2: '주거급여 인상 병행',
        body: P('2026년 주거급여 기준임대료가 인상되었습니다. 서울 4인 가구 기준 약 52만 원 수준으로 상향되어, 청년월세지원과 주거급여가 각기 다른 대상에 중첩 적용되는 구조입니다.')
      }
    ],
    qa: [
      { q: '상시 신청이면 아무 때나 신청해도 되나요?', a: '연중 가능하지만, 선정 후 월세 납부 확인 시점부터 지급되므로 임대차계약·독립 거주가 완료된 직후 신청하는 것이 유리합니다.' },
      { q: '주거급여와 중복 수급이 가능한가요?', a: '주거급여 수급자는 청년월세지원 대상에서 제외됩니다. 둘 중 유리한 제도를 선택해야 합니다.' }
    ],
    sources: [
      { url: 'https://www.bokjiro.go.kr', label: '복지로', desc: '청년월세지원 신청·모의계산' },
      { url: 'https://www.molit.go.kr', label: '국토교통부', desc: '소관 부처 안내' },
      { url: 'https://www.korea.kr', label: '정책브리핑', desc: '공식 발표 및 배경' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/09/2026-youth-rent-support-korea/', label: '2026 청년 월세 지원 신청 가이드', desc: '청약통장 폐지·480만 원·5월 29일 마감' },
      { url: 'https://aibizinsider.com/2026/03/31/youth-rent-support-2026-guide/', label: '2026 청년월세지원 달라진 점', desc: '상시신청 전환' }
    ]
  })
};

// --- 472: 고유가 피해지원금 총정리 ---
posts[472] = {
  title: '2026 고유가 피해지원금 총정리 — 소득 하위 70%, 최대 60만 원 차등 지급 일정과 신청 방법',
  content: buildPolicyPost({
    eyebrow: '정부 추경 · 2026.04.05',
    title: '2026 고유가 피해지원금 총정리',
    subtitle: '소득 하위 70% · 최대 60만 원 · 차등 지급 일정과 방법',
    tldr: [
      { label: '대상', text: '건강보험료 기준 소득 하위 70%' },
      { label: '금액', text: '10만~60만 원, 지역·계층별 차등' },
      { label: '1차 지급', text: '기초·차상위·한부모 자동 지급' },
      { label: '2차 지급', text: '일반 국민 신청 후 순차 지급' },
      { label: '형태', text: '지역사랑상품권·카드 포인트 충전' }
    ],
    intro: P('중동 정세 불안으로 국제유가가 급등하자 정부가 <strong>고유가 피해지원금</strong>을 신설했습니다. 소득 하위 70%에 지역·계층별 차등 지급됩니다.'),
    sections: [
      {
        h2: '계층별 지급 금액',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>기초생활수급자·한부모</strong>: 최대 60만 원</li>
        <li><strong>차상위계층</strong>: 최대 50만 원</li>
        <li><strong>인구감소 특별지역 일반 가구</strong>: 25만 원</li>
        <li><strong>인구감소 우대지역 일반 가구</strong>: 20만 원</li>
        <li><strong>비수도권 일반 가구</strong>: 15만 원</li>
        <li><strong>수도권 일반 가구</strong>: 10만 원</li>
        </ul>`,
        analysis: '계층·지역 가중치를 결합한 선별 지급 구조는 취약계층 지원 실효성을 높이는 동시에 지역 소비 활성화를 유도하는 이중 목표를 담고 있습니다.'
      },
      {
        h2: '신청 방법',
        body: P('기초수급자·차상위·한부모는 <strong>자동 지급</strong>, 일반 가구는 정부24·복지로·주민센터에서 신청합니다. 사용처는 지역사랑상품권 또는 신용·체크카드 포인트 충전입니다.')
      }
    ],
    qa: [
      { q: '수도권 일반 가구는 얼마인가요?', a: '1인당 10만 원입니다. 비수도권은 15만 원, 인구감소 지역은 20~25만 원까지 받을 수 있습니다.' },
      { q: '사용처에 제한이 있나요?', a: '대형마트·백화점·면세점·유흥업소·온라인쇼핑몰에서는 사용 불가합니다.' }
    ],
    sources: [
      { url: 'https://www.gov.kr', label: '정부24', desc: '지원금 신청·조회' },
      { url: 'https://www.bokjiro.go.kr', label: '복지로', desc: '취약계층 자격 조회' },
      { url: 'https://www.korea.kr', label: '정책브리핑', desc: '공식 발표' },
      { url: 'https://www.nhis.or.kr', label: '국민건강보험공단', desc: '건보료 조회' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/10/2026-fuel-subsidy-guide-korea/', label: '2026 고유가 피해지원금 완전 정리', desc: '대상·금액·신청·지급일' },
      { url: 'https://aibizinsider.com/2026/04/08/2026-fuel-subsidy-application-guide/', label: '2026 고유가 피해지원금 신청 가이드', desc: '지급일정·건보료 기준' }
    ]
  })
};

// --- 286: 반값 여행 ---
posts[286] = {
  title: '2026 반값 여행 총정리 — 여행비 50% 환급받는 지역사랑 휴가지원제 신청 방법과 대상 지역 16곳',
  content: buildPolicyPost({
    eyebrow: '문화체육관광부 내수 활성화 정책',
    title: '2026 반값 여행 총정리 — 지역사랑 휴가지원제',
    subtitle: '여행비 50% 환급 · 대상 지역 16곳 · 신청 방법',
    tldr: [
      { label: '환급률', text: '숙박·관광지 결제액의 최대 50% 환급' },
      { label: '대상 지역', text: '인구감소·관광 활성화 대상 지역 16곳' },
      { label: '환급 한도', text: '1인당 연 최대 약 10만 원 수준' },
      { label: '사용', text: '지정 숙박·관광 가맹점에서 카드 결제' },
      { label: '신청', text: '대한민국 구석구석·지자체 홈페이지' }
    ],
    intro: P('정부가 <strong>지역사랑 휴가지원제</strong>로 여행비를 최대 50% 환급합니다. 인구감소 지역 16곳의 내수 경기 활성화가 목적입니다.'),
    sections: [
      {
        h2: '환급 구조',
        body: P('지정 지역의 숙박·관광·체험 결제 후 카드 매출 데이터 기반으로 <strong>최대 50% 환급</strong>됩니다. 1인당 연간 한도는 약 10만 원 수준이며, 예산 소진 시 마감됩니다.'),
        analysis: '단순 관광 진흥이 아니라 인구감소 지역의 지속적 방문 수요 창출을 겨냥한 구조로, 지역화폐·숙박쿠폰과 병행 사용 시 실질 부담이 크게 낮아집니다.'
      },
      {
        h2: '신청·이용 방법',
        body: `<ol style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li>대한민국 구석구석 또는 지자체 누리집에서 참여 등록</li>
        <li>지정 가맹점에서 신용·체크카드로 결제</li>
        <li>매출 확인 후 환급금 카드·계좌로 입금</li>
        <li>예산 소진 전 신청 (조기 마감 가능)</li>
        </ol>`
      }
    ],
    qa: [
      { q: '어디에서 쓸 수 있나요?', a: '지정된 16개 지역의 가맹 숙박·관광·체험 업소에서 카드 결제 시 환급 대상입니다. 대한민국 구석구석에서 지역·업종을 확인할 수 있습니다.' },
      { q: '온라인 여행상품도 되나요?', a: '제휴 여행플랫폼 일부 상품은 대상이나, 현장 결제 가맹점 기준이 원칙입니다. 예약 시 공식 안내를 확인하세요.' }
    ],
    sources: [
      { url: 'https://korean.visitkorea.or.kr', label: '대한민국 구석구석', desc: '가맹점·프로그램 안내' },
      { url: 'https://www.mcst.go.kr', label: '문화체육관광부', desc: '소관 부처' },
      { url: 'https://www.korea.kr', label: '정책브리핑', desc: '공식 안내' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/10/2026-fuel-subsidy-guide-korea/', label: '2026 고유가 피해지원금 완전 정리', desc: '대상·금액·신청' },
      { url: 'https://aibizinsider.com/2026/04/06/2026-youth-rent-support-permanent/', label: '2026 청년월세지원 상시화', desc: '월 20만 원·480만 원' }
    ]
  })
};

// --- 246: 육아기 10시 출근제 ---
posts[246] = {
  title: '2026년 육아기 10시 출근제 완벽 정리 — 임금 삭감 없이 육아와 직장 병행하는 방법',
  content: buildPolicyPost({
    eyebrow: '고용노동부 일·가정 양립 정책',
    title: '2026 육아기 10시 출근제 완벽 정리',
    subtitle: '임금 삭감 없이 육아와 직장 병행',
    tldr: [
      { label: '대상', text: '만 8세 이하 자녀를 둔 근로자' },
      { label: '핵심', text: '오전 10시 출근·오후 6~7시 퇴근으로 조정' },
      { label: '임금', text: '원칙적으로 임금 삭감 없음' },
      { label: '기간', text: '자녀 연령 조건 내 연중 사용 가능' },
      { label: '신청', text: '회사에 사전 고지 후 사업주 확인' }
    ],
    intro: P('2026년 시행되는 <strong>육아기 10시 출근제</strong>는 만 8세 이하 자녀를 둔 근로자가 출근 시간을 오전 10시로 조정해도 임금 삭감 없이 근무할 수 있도록 한 제도입니다.'),
    sections: [
      {
        h2: '제도의 핵심',
        body: P('기존 육아기 근로시간 단축제는 근로시간이 줄어든 만큼 임금도 줄었습니다. 10시 출근제는 <strong>근무시간 총량은 유지</strong>하면서 시작 시간을 늦추는 방식이라 임금 삭감이 없습니다.'),
        analysis: '등원 시간과 출근 시간의 구조적 불일치를 해소하기 위한 맞춤형 제도입니다. 단축제와 병행 선택할 수 있어 가정 상황에 따른 유연성이 높아졌습니다.'
      },
      {
        h2: '신청 방법',
        body: `<ol style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li>회사에 사용 시점 최소 30일 전 사전 고지</li>
        <li>사업주 확인 후 근로시간 변경 합의</li>
        <li>자녀 연령 증빙 제출 (가족관계증명서 등)</li>
        <li>시행 중 변경 필요 시 재협의</li>
        </ol>`
      }
    ],
    qa: [
      { q: '사업주가 거부할 수 있나요?', a: '정당한 사유 없는 거부는 불가하며, 위반 시 과태료가 부과될 수 있습니다. 다만 업무 특성상 협의 조정은 가능합니다.' },
      { q: '근로시간 단축제와 병행 사용 가능한가요?', a: '가정 상황에 따라 선택 사용 또는 단계적 전환이 가능합니다. 단, 동시에 두 제도를 중복 적용하지는 않습니다.' }
    ],
    sources: [
      { url: 'https://www.moel.go.kr', label: '고용노동부', desc: '제도 원문·시행 안내' },
      { url: 'https://www.work24.go.kr', label: '고용24', desc: '신청·상담' },
      { url: 'https://www.worklife.kr', label: '일생활균형포털', desc: '제도 활용 가이드' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/07/2026-april-health-insurance-year-end-settlement-automation/', label: '2026 건강보험료 연말정산 자동화', desc: '추가납부·환급·분할납부' },
      { url: 'https://aibizinsider.com/2026/04/06/2026-youth-rent-support-permanent/', label: '2026 청년월세지원 상시화', desc: '월 20만 원·480만 원' }
    ]
  })
};

// --- 134: 청년월세지원 달라진 점 ---
posts[134] = {
  title: '2026 청년월세지원 달라진 점 총정리 — 상시신청 전환으로 최대 480만 원 받는 법',
  content: buildPolicyPost({
    eyebrow: '국토교통부 · 2026 개편',
    title: '2026 청년월세지원 달라진 점 총정리',
    subtitle: '상시신청 전환·청약통장 폐지·최대 480만 원',
    tldr: [
      { label: '상시신청', text: '1년 내내 접수, 모집 기간 폐지' },
      { label: '청약통장', text: '가입 요건 완전 폐지' },
      { label: '금액', text: '월 20만 원 × 24개월 = 480만 원' },
      { label: '대상', text: '만 19~34세 무주택 청년' },
      { label: '소득', text: '청년 중위 60%, 원가구 중위 100% 이하' }
    ],
    intro: P('2026년 청년월세지원은 <strong>상시신청 체계</strong>로 바뀌고 청약통장 요건이 폐지되었습니다. 지원 금액은 그대로지만 접근성이 크게 개선되었습니다.'),
    sections: [
      {
        h2: '무엇이 달라졌나',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>① 청약통장 요건 폐지</strong> — 통장 없이도 신청 가능</li>
        <li><strong>② 상시 신청 전환</strong> — 1·2차 모집 구분 폐지</li>
        <li><strong>③ 간편 서류 확대</strong> — 건강보험료 기반 모의계산 강화</li>
        </ul>`,
        analysis: '청년층 실수요가 가장 높은 시점에 즉시 신청할 수 있도록 개편된 점이 핵심입니다. 주거 안정성의 시간적 사각지대를 줄이는 조치입니다.'
      },
      {
        h2: '신청 절차',
        body: `<ol style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li>복지로 모의계산으로 자격 확인</li>
        <li>임대차계약서·가족관계증명서·건보료 납부확인서 준비</li>
        <li>복지로 또는 주민센터 신청</li>
        <li>선정 후 매월 월세 납부 확인 시 지급</li>
        </ol>`
      }
    ],
    qa: [
      { q: '이미 지원받고 있는데 새 제도를 적용받을 수 있나요?', a: '기존 수급자는 진행 중인 지원이 우선이며, 종료 후 재신청은 불가(생애 1회)합니다.' },
      { q: '상시신청이면 언제 신청하는 게 유리한가요?', a: '임대차계약·독립 거주 확정 직후가 유리합니다. 월세 납부 확인 시점부터 지급됩니다.' }
    ],
    sources: [
      { url: 'https://www.bokjiro.go.kr', label: '복지로', desc: '온라인 신청·모의계산' },
      { url: 'https://www.molit.go.kr', label: '국토교통부', desc: '소관 부처' },
      { url: 'https://www.gov.kr', label: '정부24', desc: '민원 통합' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/09/2026-youth-rent-support-korea/', label: '2026 청년월세지원 신청 가이드', desc: '5월 29일 마감' },
      { url: 'https://aibizinsider.com/2026/04/06/2026-youth-rent-support-permanent/', label: '2026 청년월세지원 상시화 총정리', desc: '주거급여 인상 현황' }
    ]
  })
};

// --- 108: 장기간부 도약적금 ---
posts[108] = {
  title: '2026년 3월 시행! 장기복무 간부 도약적금 완벽 정리 — 월 30만 원으로 3년 후 2,315만 원 받는 법',
  content: buildPolicyPost({
    eyebrow: '국방부 · 장기복무 유인 정책',
    title: '2026 장기복무 간부 도약적금 완벽 정리',
    subtitle: '월 30만 원 × 3년 → 만기 약 2,315만 원',
    tldr: [
      { label: '대상', text: '장기복무 희망 부사관·장교' },
      { label: '납입', text: '월 최대 30만 원, 3년 만기' },
      { label: '수령액', text: '정부 매칭·이자 포함 약 2,315만 원' },
      { label: '시행', text: '2026년 3월부터' },
      { label: '취지', text: '장기복무 유인·간부 처우 개선' }
    ],
    intro: P('국방부가 <strong>장기복무 간부 도약적금</strong>을 2026년 3월 시행합니다. 월 30만 원씩 3년 납입하면 정부 지원과 이자가 더해져 만기 시 약 2,315만 원을 수령할 수 있습니다.'),
    sections: [
      {
        h2: '수령액 구성',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>본인 납입액</strong>: 월 30만 원 × 36개월 = 1,080만 원</li>
        <li><strong>정부 매칭 지원금</strong>: 일정 비율 추가 적립</li>
        <li><strong>이자·세제 혜택</strong>: 비과세 또는 저과세 구조</li>
        <li><strong>만기 수령액</strong>: 약 2,315만 원</li>
        </ul>`,
        analysis: '장병 적금(전역 후 1,900만 원대)과 비교해 장기복무자 전용으로 설계된 더 큰 규모의 자산 형성 지원입니다. 간부 처우 개선과 인력 유지를 동시에 노린 이중 정책입니다.'
      },
      {
        h2: '신청 요건',
        body: P('장기복무 선발·지원자로서 병과·계급·복무기간 조건을 충족해야 합니다. 상세 요건은 국방부 인사관리 시스템과 각 군 공지를 확인하세요.')
      }
    ],
    qa: [
      { q: '중도 해지 시 지원금은요?', a: '정부 매칭분은 만기 유지가 원칙이며, 중도 해지 시 일부 또는 전부 환수될 수 있습니다.' },
      { q: '기존 장병적금과 중복 가입 가능한가요?', a: '장병적금은 병사 대상, 도약적금은 간부 대상으로 가입 트랙이 다릅니다. 전환 복무 시 조건에 따라 재가입이 가능합니다.' }
    ],
    sources: [
      { url: 'https://www.mnd.go.kr', label: '국방부', desc: '제도 원문·시행 공고' },
      { url: 'https://www.mma.go.kr', label: '병무청', desc: '복무 관련 안내' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/07/2026-april-health-insurance-year-end-settlement-automation/', label: '2026 건강보험료 연말정산 자동화', desc: '추가납부·환급 안내' },
      { url: 'https://aibizinsider.com/2026/03/30/integrated-care-act-2026-korea/', label: '2026 통합돌봄지원법 완벽 정리', desc: '대상·서비스' }
    ]
  })
};

// --- 106: 통합돌봄지원법 ---
posts[106] = {
  title: '2026년 3월 전국 시행! 통합돌봄지원법 완벽 정리 — 대상자·신청방법·서비스 총정리',
  content: buildPolicyPost({
    eyebrow: '보건복지부 · 2026.03 전국 시행',
    title: '2026 통합돌봄지원법 완벽 정리',
    subtitle: '대상자·신청방법·서비스 한눈에',
    tldr: [
      { label: '시행', text: '2026년 3월 전국 시행' },
      { label: '대상', text: '노인·장애인·퇴원 환자 등 돌봄 필요자' },
      { label: '서비스', text: '의료·요양·생활 지원의 지역 통합 제공' },
      { label: '신청', text: '주민센터·국민건강보험공단·지자체 통합창구' },
      { label: '근거법', text: '의료·요양 등 통합돌봄지원법' }
    ],
    intro: P('<strong>통합돌봄지원법</strong>이 2026년 3월 전국 시행됩니다. 노인·장애인·퇴원 환자 등에게 의료·요양·생활 지원을 지역 단위로 통합 제공합니다.'),
    sections: [
      {
        h2: '주요 서비스',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>의료·건강</strong>: 방문 진료, 간호, 재활</li>
        <li><strong>요양</strong>: 방문 요양, 주야간 보호</li>
        <li><strong>생활 지원</strong>: 식사·이동·주거 편의</li>
        <li><strong>사례 관리</strong>: 개별 맞춤 통합 플랜</li>
        </ul>`,
        analysis: '분절돼 있던 건강보험·노인장기요양·복지 서비스를 지자체 단위 통합창구로 모아 돌봄 공백을 줄이는 구조적 전환입니다. 초고령 사회 대응의 기반 인프라입니다.'
      },
      {
        h2: '신청 방법',
        body: P('거주지 주민센터·국민건강보험공단 지사·지자체 통합돌봄창구에서 신청합니다. 본인·가족·의료기관이 의뢰할 수 있습니다.')
      }
    ],
    qa: [
      { q: '기존 장기요양과 어떻게 다른가요?', a: '장기요양은 요양 서비스 중심이지만 통합돌봄은 의료·요양·생활 지원을 하나의 플랜으로 연계합니다.' },
      { q: '본인 부담금은 있나요?', a: '소득 수준과 서비스 종류에 따라 본인 부담이 다르며, 취약계층은 감면됩니다.' }
    ],
    sources: [
      { url: 'https://www.mohw.go.kr', label: '보건복지부', desc: '제도 원문' },
      { url: 'https://www.nhis.or.kr', label: '국민건강보험공단', desc: '장기요양·통합돌봄 연계' },
      { url: 'https://www.bokjiro.go.kr', label: '복지로', desc: '복지 서비스 통합 신청' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/07/2026-april-health-insurance-year-end-settlement-automation/', label: '2026 건강보험료 연말정산 자동화', desc: '추가납부·환급' },
      { url: 'https://aibizinsider.com/2026/04/02/2026-parental-flex-hours-korea-guide/', label: '2026 육아기 10시 출근제', desc: '임금 삭감 없는 병행' }
    ]
  })
};

// --- 60: 홈택스 FAQ ---
posts[60] = {
  title: '홈택스 자주 묻는 질문(FAQ) BEST 5와 해결 방법 — 오류 대처부터 민원까지',
  content: buildPolicyPost({
    eyebrow: '국세청 홈택스 이용 가이드',
    title: '홈택스 FAQ BEST 5와 해결 방법',
    subtitle: '오류 대처부터 민원까지 한눈에',
    tldr: [
      { label: '1위', text: '공동인증서 로그인 실패' },
      { label: '2위', text: '연말정산 간소화 자료 조회 오류' },
      { label: '3위', text: '전자세금계산서 발급·수정' },
      { label: '4위', text: '종합소득세 신고 화면 오류' },
      { label: '5위', text: '세금 납부·환급 지연' }
    ],
    intro: P('홈택스 이용 시 자주 발생하는 <strong>오류·질문 TOP 5</strong>와 해결 방법을 정리했습니다. 공식 안내 기준입니다.'),
    sections: [
      {
        h2: 'BEST 5 해결법',
        body: `<ol style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>로그인 실패</strong> — 브라우저 캐시 삭제·보안 프로그램 재설치·공동인증서 경로 확인</li>
        <li><strong>간소화 자료 오류</strong> — 제공 동의 여부 확인, 회사 반영 지연 시 다음 날 재조회</li>
        <li><strong>전자세금계산서</strong> — 수정 발급은 '매출 수정' 메뉴에서, 승인 후 48시간 내 전송 확인</li>
        <li><strong>종소세 신고 오류</strong> — ActiveX/보안모듈 최신화, 크롬·엣지 호환 모드 전환</li>
        <li><strong>납부·환급 지연</strong> — 환급은 신고 후 평균 30일, 계좌 변경은 '계좌관리' 메뉴에서 즉시 가능</li>
        </ol>`,
        analysis: '홈택스 이슈의 약 70%는 브라우저·보안 프로그램 환경 문제입니다. 크롬·엣지 최신 버전·개인 PC 환경을 유지하는 것이 예방의 핵심입니다.'
      }
    ],
    qa: [
      { q: '모바일에서도 같은 오류가 발생하나요?', a: '손택스 앱은 PC보다 오류가 적습니다. 간단 조회·납부는 손택스 사용을 권장합니다.' }
    ],
    sources: [
      { url: 'https://www.hometax.go.kr', label: '홈택스 (hometax.go.kr)', desc: '국세청 공식 포털' },
      { url: 'https://www.nts.go.kr', label: '국세청', desc: '세무 안내' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/09/nts-real-estate-tax-evasion-reward-40billion-2026-04-09/', label: '국세청 부동산 탈세 제보 포상금 40억', desc: '제보 접수 현황' },
      { url: 'https://aibizinsider.com/2026/04/07/2026-april-health-insurance-year-end-settlement-automation/', label: '2026 건강보험료 연말정산 자동화', desc: '추가납부·환급' }
    ]
  })
};

// --- 64: 이태원 참사 2년 ---
posts[64] = {
  title: '잊지 말아야 할 이태원 참사 2년 — 희생자와 유가족, 그리고 안전 사회의 염원',
  content: buildPolicyPost({
    eyebrow: '사회 · 안전 정책',
    title: '잊지 말아야 할 이태원 참사 2년',
    subtitle: '희생자와 유가족, 그리고 안전 사회의 염원',
    tldr: [
      { label: '배경', text: '2022년 10월 29일 발생한 다중밀집 참사' },
      { label: '희생', text: '희생자 159명, 유가족·생존자 지속 치유 과정' },
      { label: '제도', text: '다중운집 안전관리 체계 개편·특별법 제정' },
      { label: '추모', text: '매년 10·29 추모 주간 운영' },
      { label: '과제', text: '군중 밀집 관리·재난관리 책임 법제화' }
    ],
    intro: P('이태원 참사 2주기를 맞아 희생자와 유가족을 추모하고, 그간 제도화된 <strong>다중운집 안전관리 개편</strong>을 짚어봅니다.'),
    sections: [
      {
        h2: '제도 변화',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li>주최자 없는 행사에 대한 지자체 안전관리 책임 명문화</li>
        <li>인파 밀집 감지·경보 체계(스마트 CCTV·통신 빅데이터) 도입</li>
        <li>경찰·소방·지자체 공동 대응 매뉴얼 정비</li>
        <li>이태원 참사 특별법 및 피해자 지원 체계</li>
        </ul>`,
        analysis: '참사 이후 재난관리의 패러다임이 \'사전 예방·공동 책임\' 중심으로 이동했습니다. 그러나 현장 집행력과 지자체 역량 편차는 여전한 과제입니다.'
      }
    ],
    sources: [
      { url: 'https://www.mois.go.kr', label: '행정안전부', desc: '재난관리 정책' },
      { url: 'https://www.korea.kr', label: '정책브리핑', desc: '특별법·추모 안내' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/04/08/public-vehicle-odd-even-day-2026-april/', label: '공공기관 차량 2부제 시행', desc: '공영주차장 5부제' },
      { url: 'https://aibizinsider.com/2026/03/30/integrated-care-act-2026-korea/', label: '2026 통합돌봄지원법', desc: '대상·서비스' }
    ]
  })
};

// --- 88: 정부24 완전정복 ---
posts[88] = {
  title: '정부24 완전정복 — 모든 민원을 한 곳에서 해결하는 방법 총정리',
  content: buildPolicyPost({
    eyebrow: '정부24 이용 가이드',
    title: '정부24 완전정복 — 모든 민원 한 곳에서',
    subtitle: '회원가입·인증·민원 신청·발급까지',
    tldr: [
      { label: '서비스', text: '정부·지자체 민원·보조금·증명서 통합' },
      { label: '인증', text: '공동·금융·간편인증 다양' },
      { label: '증명서', text: '주민등록등본·가족관계·토지대장 무료 발급' },
      { label: '복지', text: '보조금24로 내 맞춤 혜택 조회' },
      { label: '앱', text: '정부24 모바일 앱으로 즉시 이용' }
    ],
    intro: P('<strong>정부24</strong>는 수천 종의 민원·증명서·보조금을 한 곳에서 처리할 수 있는 대표 정부 포털입니다.'),
    sections: [
      {
        h2: '핵심 기능',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>민원 신청·발급</strong>: 등본·초본·가족관계증명서</li>
        <li><strong>보조금24</strong>: 내가 받을 수 있는 중앙·지자체 혜택 자동 조회</li>
        <li><strong>MyGOV</strong>: 나의 신청내역 통합 관리</li>
        <li><strong>간편인증</strong>: 카카오·네이버·PASS 등</li>
        </ul>`,
        analysis: '\'내가 찾아가는 행정\'에서 \'알아서 제공되는 행정\'으로 전환되는 흐름의 중심 채널입니다. 보조금24·MyGOV 사용률이 정책 수혜율을 좌우합니다.'
      }
    ],
    sources: [
      { url: 'https://www.gov.kr', label: '정부24 (gov.kr)', desc: '공식 포털' },
      { url: 'https://www.mois.go.kr', label: '행정안전부', desc: '소관 부처' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/03/30/gov24-mygov-service-guide-2026/', label: '2026 정부24 MyGOV 서비스 가이드', desc: '민원·혜택 알리미' },
      { url: 'https://aibizinsider.com/2026/03/30/gov24-my-applications-guide/', label: '정부24 나의 신청내역 활용법', desc: '신청 이력 관리' }
    ]
  })
};

// --- 89: 정부24 나의 신청내역 ---
posts[89] = {
  title: '정부24 나의 신청내역 완벽 활용법 — 내가 신청한 모든 서비스 한눈에 관리하기',
  content: buildPolicyPost({
    eyebrow: '정부24 MyGOV 활용',
    title: '정부24 나의 신청내역 완벽 활용법',
    subtitle: '신청한 모든 서비스를 한눈에 관리',
    tldr: [
      { label: '위치', text: '정부24 로그인 → MyGOV → 나의 신청내역' },
      { label: '기능', text: '신청·처리 상태·증명서 재발급·이의신청 통합' },
      { label: '알림', text: '처리 상태 변경 시 카톡·문자 알림' },
      { label: '보관', text: '신청 이력 5년 이상 조회 가능' },
      { label: '활용', text: '복지·민원·세무 동시 관리' }
    ],
    intro: P('<strong>정부24 나의 신청내역</strong>은 내가 신청·접수한 모든 민원과 보조금의 처리 상태를 한 화면에서 확인·재발급·이의신청할 수 있는 기능입니다.'),
    sections: [
      {
        h2: '핵심 기능',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li>신청·접수·처리·완료 상태 단계별 확인</li>
        <li>발급 증명서 PDF 재발급</li>
        <li>처리 지연·반려 시 이의신청 바로가기</li>
        <li>카톡·문자 처리 알림</li>
        </ul>`,
        analysis: '개별 기관 사이트를 돌아다니지 않고 한 화면에서 전 국가 민원 이력을 확인하는 행정 UX의 핵심 도구입니다.'
      }
    ],
    sources: [
      { url: 'https://www.gov.kr', label: '정부24', desc: '공식 포털' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/03/30/gov24-complete-guide-2026/', label: '정부24 완전정복', desc: '전체 기능 정리' },
      { url: 'https://aibizinsider.com/2026/03/30/gov24-mygov-service-guide-2026/', label: '정부24 MyGOV 서비스 가이드', desc: '혜택 알리미' }
    ]
  })
};

// --- 90: 정부24 MyGOV ---
posts[90] = {
  title: '2026년 정부24 MyGOV 서비스 완벽 이용가이드 — 민원 신청부터 혜택 알리미까지',
  content: buildPolicyPost({
    eyebrow: '정부24 MyGOV 가이드',
    title: '2026 정부24 MyGOV 서비스 완벽 이용가이드',
    subtitle: '민원 신청부터 혜택 알리미까지',
    tldr: [
      { label: 'MyGOV', text: '맞춤형 민원·혜택 통합 대시보드' },
      { label: '혜택 알리미', text: '내가 받을 수 있는 보조금 자동 안내' },
      { label: '민원', text: '신청·발급·진행상태 관리' },
      { label: '연동', text: '카카오톡 알림·간편인증 지원' },
      { label: '대상', text: '정부24 회원 전체' }
    ],
    intro: P('<strong>MyGOV</strong>는 정부24의 개인 맞춤 대시보드로, 내가 받을 수 있는 혜택과 진행 중인 민원을 자동 정리해 줍니다.'),
    sections: [
      {
        h2: '주요 기능',
        body: `<ul style="font-size:16px;line-height:2;padding-left:24px;margin-bottom:24px;color:#334155;">
        <li><strong>혜택 알리미</strong>: 보조금24 기반 맞춤 혜택 자동 조회</li>
        <li><strong>나의 신청내역</strong>: 처리 단계·증명서 재발급</li>
        <li><strong>자주 쓰는 민원</strong>: 개인화 즐겨찾기</li>
        <li><strong>카톡 알림</strong>: 상태 변경 푸시</li>
        </ul>`,
        analysis: '행정 서비스가 \'찾는\'에서 \'알려주는\' 구조로 전환되는 핵심 인프라입니다. 2026년 이후 건강보험·국세청 데이터 연계가 확장될 예정입니다.'
      }
    ],
    qa: [
      { q: 'MyGOV를 쓰려면 별도 가입이 필요한가요?', a: '정부24 회원이면 별도 가입 없이 바로 사용 가능합니다. 간편인증으로 로그인하면 맞춤 화면이 나타납니다.' }
    ],
    sources: [
      { url: 'https://www.gov.kr', label: '정부24', desc: 'MyGOV 공식' },
      { url: 'https://www.mois.go.kr', label: '행정안전부', desc: '소관 부처' }
    ],
    related: [
      { url: 'https://aibizinsider.com/2026/03/30/gov24-complete-guide-2026/', label: '정부24 완전정복', desc: '전체 기능' },
      { url: 'https://aibizinsider.com/2026/03/30/gov24-my-applications-guide/', label: '정부24 나의 신청내역 활용법', desc: '신청 이력 관리' }
    ]
  })
};

// Write out
const out = path.join(__dirname, 'policy_batch_output.json');
fs.writeFileSync(out, JSON.stringify(posts, null, 0), 'utf8');
console.log('Generated ' + Object.keys(posts).length + ' posts -> ' + out);
