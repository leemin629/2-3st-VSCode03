# VibeFit

AI 기반 맞춤형 운동 추천 웹앱입니다.  
사용자가 선택한 날씨, 컨디션, 운동 가능 시간을 바탕으로 Gemini API가 적절한 운동, 추천 이유, 주의사항, 운동 루틴을 추천합니다.

## 배포 링크

- Vercel 배포 링크: 추후 입력

## GitHub Repository

- GitHub: https://github.com/leemin629/2-3st-VSCode03

## 프로젝트 소개

VibeFit은 사용자의 현재 상황에 맞는 운동을 추천해주는 AI 운동 추천 서비스입니다.

사용자는 현재 날씨, 자신의 컨디션, 운동 가능한 시간을 선택할 수 있습니다.  
선택한 정보를 바탕으로 AI가 맞춤형 운동을 추천하고, 추천 이유와 주의사항, 구체적인 루틴까지 제공합니다.

## 주요 기능

- 날씨 선택 기능
- 컨디션 선택 기능
- 운동 가능 시간 선택 기능
- 선택 개수 제한 기능
  - 날씨 최대 2개 선택 가능
  - 컨디션 최대 2개 선택 가능
  - 운동 가능 시간 1개 선택 가능
- Gemini API를 활용한 AI 운동 추천
- 추천 운동 결과 화면 출력
- 추천 이유, 주의사항, 추천 루틴 제공
- Gemini 응답 JSON 파싱 안정화
- API 오류 발생 시 사용자 친화적인 에러 메시지 출력

## 사용 기술

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Vercel Serverless Function
- Node.js

### AI API

- Google Gemini API
- model: `gemini-3.6-flash`

### Deployment

- GitHub
- Vercel

## 화면 예시

### AI 운동 추천 결과 화면

아래 이미지는 VibeFit의 AI 운동 추천 결과 화면입니다.

```md
![VibeFit 결과 화면](./images/result.png)
```

이미지를 사용하려면 프로젝트 안에 `images` 폴더를 만들고, 결과 화면 이미지를 `result.png` 이름으로 저장하면 됩니다.

## 프로젝트 구조

```txt
project-root
├── api
│   └── gemini.js
├── index.html
├── style.css
├── script.js
├── README.md
└── package.json
```

## 환경 변수

이 프로젝트는 Gemini API Key가 필요합니다.

Vercel 환경 변수에 아래 값을 등록해야 합니다.

```env
GEMINI_API_KEY=본인의_Gemini_API_KEY
```

주의사항:

- API Key는 절대 GitHub에 직접 올리면 안 됩니다.
- `.env` 파일을 사용하는 경우 `.gitignore`에 반드시 포함해야 합니다.
- Vercel에서는 Project Settings의 Environment Variables 메뉴에서 등록해야 합니다.

## 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/leemin629/2-3st-VSCode03.git
cd 2-3st-VSCode03
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 로컬 실행

Vercel 개발 서버를 사용하는 경우:

```bash
vercel dev
```

정적 화면만 확인하는 경우에는 VS Code의 Live Server를 사용할 수 있습니다.  
단, Gemini API가 연결된 기능은 Vercel Serverless Function 환경에서 정상 동작합니다.

## API 동작 방식

프론트엔드에서 사용자가 선택한 날씨, 컨디션, 운동 가능 시간을 서버리스 함수로 전송합니다.

```js
fetch("/api/gemini", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    weather,
    condition,
    time,
  }),
});
```

서버에서는 전달받은 정보를 바탕으로 Gemini API에 요청을 보내고, AI가 생성한 운동 추천 결과를 JSON 형식으로 받아 화면에 출력합니다.

## AI 응답 형식

Gemini API는 다음과 같은 JSON 형식으로 운동 추천 결과를 반환합니다.

```json
{
  "exercise": "추천 운동",
  "reason": "추천 이유",
  "caution": "주의사항",
  "routine": "추천 루틴"
}
```

프론트엔드는 이 데이터를 받아서 추천 운동, 추천 이유, 주의사항, 추천 루틴 영역에 각각 출력합니다.

## AI 응답 처리 안정화

AI 응답은 항상 완전히 동일한 형식으로 오지 않을 수 있기 때문에, 안정적인 처리를 위해 다음과 같은 방어 로직을 추가했습니다.

- JSON 코드블록 제거
- 불필요한 괄호 제거
- 줄바꿈 및 공백 정리
- JSON 파싱 실패 시 에러 처리
- 필수 항목 누락 여부 검사
- 사용자에게 에러 메시지 표시
- `responseSchema`를 활용한 응답 형식 안정화
- `maxOutputTokens` 증가를 통한 응답 잘림 방지

## 트러블슈팅

### 1. Gemini API 응답 파싱 오류

AI 응답에 코드블록이나 불필요한 문자가 포함되어 `JSON.parse()` 오류가 발생했습니다.

해결 방법:

- `responseMimeType: "application/json"` 적용
- `responseSchema` 적용
- 응답 문자열 정리 후 JSON 파싱
- 필수 항목 검증 코드 추가

### 2. 환경 변수 오류

Vercel에 `GEMINI_API_KEY`가 등록되지 않으면 API 요청이 실패합니다.

해결 방법:

1. Vercel Project Settings로 이동
2. Environment Variables 메뉴 선택
3. `GEMINI_API_KEY` 추가
4. 프로젝트 재배포

### 3. Gemini 응답이 중간에 잘리는 문제

AI 응답 길이가 부족하면 JSON 응답이 중간에 잘려 파싱 오류가 발생할 수 있습니다.

해결 방법:

```js
maxOutputTokens: 1500
```

위 설정을 통해 응답 길이를 충분히 확보했습니다.

### 4. 프론트엔드와 백엔드 통신 오류

프론트엔드에서 `/api/gemini`로 요청을 보내지만 서버리스 함수가 정상적으로 동작하지 않으면 오류가 발생할 수 있습니다.

해결 방법:

- `api/gemini.js` 파일 위치 확인
- Vercel 배포 상태 확인
- Network 탭에서 API 응답 확인
- 환경 변수 등록 여부 확인

## 배운 점

이번 프로젝트를 통해 다음 내용을 학습했습니다.

- HTML, CSS, JavaScript를 이용한 웹앱 제작
- 사용자 선택값 처리
- 선택 개수 제한 기능 구현
- 프론트엔드와 백엔드 API 통신
- Vercel Serverless Function 사용
- Gemini API 연동
- 환경 변수 관리
- AI 응답 JSON 파싱
- API 오류 방어 코드 작성
- GitHub와 Vercel을 활용한 배포
- 실제 AI API를 활용한 서비스 제작 과정

## 향후 개선 방향

- 추천 결과 저장 기능 추가
- 운동 난이도 선택 기능 추가
- 사용자 체력 수준 반영
- 모바일 UI 개선
- 추천 결과 공유 기능 추가
- 운동 이미지 또는 영상 링크 제공
- 이전 추천 기록 확인 기능 추가

## 개발자

- 개발자: leemin629
- GitHub: https://github.com/leemin629/2-3st-VSCode03

## 실행 후 화면

<img width="1888" height="905" alt="VibeFit01" src="https://github.com/user-attachments/assets/cd0e3b36-4cc2-456b-af13-1d5e4108e790" />

<img width="1897" height="898" alt="VibeFit02" src="https://github.com/user-attachments/assets/dd825385-a897-4bf8-a002-22c760994801" />

<img width="1893" height="910" alt="VibeFit03" src="https://github.com/user-attachments/assets/57047d7f-5b9b-4fd6-911c-8a66050a32d9" />

<img width="1903" height="899" alt="VibeFit04" src="https://github.com/user-attachments/assets/bc0971d3-3fff-458c-9f45-14babc9b6a46" />


## 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.
