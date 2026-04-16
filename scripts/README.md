# aibizinsider.com 자동화 스크립트

## expand-related-links.js

각 포스트의 "관련 글" 섹션 링크를 2~3개에서 4~5개로 확장합니다.

### 사전 준비: WordPress.com 액세스 토큰 발급

1. https://developer.wordpress.com/apps/ 접속
2. "Create New Application" 클릭
3. 앱 정보 입력:
   - Name: `aibizinsider-automation`
   - Description: 내부 자동화용
   - Website URL: `https://aibizinsider.com`
   - Redirect URL: `http://localhost`
4. 생성 후 상단의 **Client ID**, **Client Secret** 확인
5. 아래 URL을 브라우저에서 열어 인증:
   ```
   https://public-api.wordpress.com/oauth2/authorize?client_id=CLIENT_ID&redirect_uri=http://localhost&response_type=token&scope=global
   ```
6. 로그인 후 redirect URL에서 `access_token=xxx...` 부분 복사

### 실행

```bash
# 환경변수 설정 (Windows cmd)
set WPCOM_TOKEN=your_access_token_here

# 환경변수 설정 (PowerShell)
$env:WPCOM_TOKEN="your_access_token_here"

# Dry-run 먼저 실행해 변경 내용 확인
node expand-related-links.js --dry-run --limit=5

# 실제 실행
node expand-related-links.js
```

### 옵션

- `--dry-run` : 실제 업데이트 없이 변경 예정 내용만 출력
- `--limit=N` : 최대 N개 포스트만 처리 (테스트용)

### 로직

1. 전체 포스트 수집 (카테고리 포함)
2. 각 포스트의 "관련 글" 섹션 파싱
3. 링크가 4개 미만이면:
   - 같은 카테고리 포스트 중 제목 유사도+날짜 인접성 기준으로 후보 선정
   - 기존 링크와 중복 제외
   - 5개가 되도록 `<li>` 추가
4. 업데이트 (API rate limit 방지용 300ms 대기)

### 안전장치

- 섹션 없으면 스킵 (구조화 안 된 포스트 보호)
- 기존 4+ 개면 스킵 (과도 수정 방지)
- 실패 시 해당 포스트만 건너뛰고 계속 진행
