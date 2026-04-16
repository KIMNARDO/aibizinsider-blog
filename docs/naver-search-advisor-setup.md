# 네이버 서치 어드바이저 등록 가이드

aibizinsider.com을 네이버 검색 결과에 노출시키기 위한 설정.
**구글 Search Console과 별도 시스템**이므로 개별 등록 필요.

---

## ⚠️ 사전 인지 사항

### 네이버 vs 구글의 외부 블로그 대우
- 네이버는 **자사 플랫폼(네이버 블로그·카페·뉴스)을 검색 결과에서 우대**
- 외부 WordPress·Tistory 블로그는 아무리 SEO 잘해도 **네이버 메인 검색에서 상위 노출 어려움**
- 다만 **웹 검색·뷰·이미지 탭**에서는 노출 가능
- 등록 안 하면 네이버 봇 크롤링 자체가 제한적 → 등록은 최소 필수

### 기대 효과
- 네이버 검색 유입 (월 10~100건 수준, 블로그 규모에 따라)
- 네이버 웹 탭 노출
- 블로그 이름 직접 검색 시 노출

---

## 📋 등록 절차 (5단계)

### Step 1. 네이버 서치 어드바이저 접속

URL: https://searchadvisor.naver.com/

네이버 아이디로 로그인.

### Step 2. 사이트 등록

1. 상단 **"웹마스터 도구"** 클릭
2. **"사이트 추가"** 버튼
3. 도메인 입력: `https://aibizinsider.com`
4. 소유 확인 방법 선택 → **"HTML 태그"** 권장

### Step 3. HTML 태그로 소유권 확인

네이버가 발급하는 `<meta>` 태그를 복사합니다. 형태:
```html
<meta name="naver-site-verification" content="abc123xyz..." />
```

**WordPress.com에 추가하는 방법** (개인 요금제):

#### Option A: Jetpack 'Site Verification' 도구 (권장)
1. WordPress.com 관리자 접속
2. 좌측 메뉴 **Jetpack → 설정 → 엔진**
3. 또는 **관리 → 설정 → 일반 → Site Verification Services**
4. "네이버 사이트 확인" 필드에 `content=` 값만 붙여넣기 (예: `abc123xyz...`)
5. 저장

#### Option B: 테마 헤더에 직접 삽입 (Personal plan 제한될 수 있음)
- Jetpack 옵션이 안 보이면 이 방법 필요
- 관리자 → 외모 → 테마 에디터 → header.php의 `</head>` 직전에 `<meta>` 태그 삽입

#### Option C: 플러그인 필요 (비즈니스 플랜부터)
- Yoast SEO, All In One SEO 플러그인이 이 기능 제공
- Personal 요금제는 플러그인 설치 불가 → Jetpack 내장 기능 활용

### Step 4. 확인 요청 클릭

서치 어드바이저에서 **"확인"** 버튼. 성공하면 사이트 대시보드 접근.

### Step 5. 사이트맵 제출

1. 좌측 메뉴 **요청 → 사이트맵 제출**
2. URL 입력: `https://aibizinsider.com/sitemap.xml`
3. 확인 클릭

**Yoast가 자동 생성하는 사이트맵**:
- `https://aibizinsider.com/sitemap_index.xml`
- `https://aibizinsider.com/sitemap.xml`

둘 다 제출 권장.

---

## 🎯 추가 권장 설정

### 1. RSS 등록
- 좌측 메뉴 **요청 → RSS 제출**
- URL: `https://aibizinsider.com/feed/`
- 새 포스트 발행 시 자동 크롤링 촉진

### 2. robots.txt 확인
- 좌측 메뉴 **도구 → robots.txt**
- 네이버 봇(`Yeti`) 차단되지 않는지 확인
- WordPress.com 기본 robots.txt에서는 대부분 허용됨

### 3. URL 검사 도구
- 새 포스트 발행 후 상위 10개 URL은 수동 제출
- 좌측 메뉴 **요청 → 웹페이지 수집**

### 4. 크롤링 리포트 주기적 확인
- **통계 → 크롤링 통계**: 네이버 봇이 어떤 페이지를 긁어갔는지 확인
- 404 등 오류 있으면 우선 처리

---

## 📊 등록 후 모니터링

### 1주일 후 확인
- 검색창에 `site:aibizinsider.com` → 노출 URL 개수 확인
- `aibizinsider` 검색 → 블로그 노출 확인

### 1개월 후 확인
- 서치 어드바이저 → **검색 노출 통계**
- 어떤 키워드로 유입됐는지 확인
- 클릭률 낮은 키워드 → 제목·메타 설명 개선

---

## ⚠️ 주의 사항

### Personal 요금제의 제한
- 플러그인 설치 불가 → Jetpack 내장 기능만 활용 가능
- 고급 SEO 플러그인(Rank Math, Yoast Premium) 불가
- 네이버 전용 SEO 플러그인 설치 불가

### 대안
- WordPress.com 비즈니스 플랜 업그레이드 (월 $25) → 플러그인 자유
- 혹은 Self-hosted WordPress로 마이그레이션

### 기대 트래픽 현실
- 외부 WordPress의 네이버 유입은 **월 10~500 세션** 범위가 일반적
- 구글 유입(월 1,000~10,000 세션 가능)이 훨씬 효율적
- **핵심 트래픽 엔진은 구글로 가져가고, 네이버는 부차적으로 관리**

---

## 🔗 체크리스트

- [ ] 네이버 서치 어드바이저 가입
- [ ] 사이트 추가 (aibizinsider.com)
- [ ] HTML 태그 복사
- [ ] WordPress.com Jetpack에 메타 태그 삽입
- [ ] 소유권 확인
- [ ] 사이트맵 제출 (sitemap.xml, sitemap_index.xml)
- [ ] RSS 제출 (/feed/)
- [ ] robots.txt 네이버 봇 허용 확인
- [ ] 중요 포스트 10개 URL 수동 제출
- [ ] 1주 후 노출 상태 확인

---

**소요 시간**: 15~20분 (설정) + 며칠 (네이버 크롤링 대기)
