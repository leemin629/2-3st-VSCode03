# VibeFit

VibeFit은 사용자의 현재 상황에 맞는 운동을 추천해주는 AI 기반 맞춤형 운동 추천 웹앱입니다.  
사용자가 선택한 날씨, 컨디션, 운동 가능 시간을 바탕으로 Gemini API가 적절한 운동, 추천 이유, 주의사항, 운동 루틴을 추천합니다.

---

## 배포 링크

- Vercel 배포 URL: https://2-3st-vs-code03.vercel.app/#recommend

---

## GitHub Repository

- GitHub: https://github.com/leemin629/2-3st-VSCode03

---

## 프로젝트 소개

VibeFit은 사용자가 자신의 현재 상태에 맞는 운동을 쉽게 선택할 수 있도록 돕는 AI 운동 추천 서비스입니다.

운동을 하고 싶지만 어떤 운동을 해야 할지 고민되는 사용자를 위해, 현재 날씨와 컨디션, 운동 가능 시간을 입력받고 AI가 맞춤형 운동을 추천합니다.

예를 들어 사용자가 “비 오는 날”, “피곤함”, “10분”을 선택하면 실내에서 짧게 할 수 있는 가벼운 스트레칭이나 회복 운동 루틴을 추천받을 수 있습니다.

---

## 서비스 목적

- 사용자의 상황에 맞는 운동을 쉽게 추천받을 수 있도록 돕기
- 날씨, 컨디션, 운동 가능 시간에 따라 무리하지 않는 운동 루틴 제공
- AI API를 활용해 개인화된 운동 추천 경험 제공

---

## 타겟 사용자

- 운동을 시작하고 싶지만 어떤 운동을 해야 할지 모르는 사람
- 날씨나 몸 상태에 따라 운동을 조절하고 싶은 사람
- 짧은 시간 안에 간단한 운동 루틴을 추천받고 싶은 사람
- 집, 실내, 야외 등 상황에 맞는 운동을 찾고 싶은 사람

---

## 페이지/섹션 구성

VibeFit은 하나의 웹페이지 안에서 메뉴를 통해 이동할 수 있는 섹션형 구조로 제작되었습니다.

### 1. 홈 섹션

- 서비스 이름과 핵심 소개를 보여줍니다.
- 사용자가 어떤 기능을 사용할 수 있는지 간단히 안내합니다.

### 2. 추천 입력 섹션

- 사용자가 현재 날씨, 컨디션, 운동 가능 시간을 선택합니다.
- 선택한 값을 바탕으로 AI 운동 추천을 요청할 수 있습니다.

### 3. AI 추천 결과 섹션

- Gemini API가 추천한 운동 결과를 화면에 출력합니다.
- 추천 운동, 추천 이유, 주의사항, 추천 루틴을 제공합니다.

### 4. 사용 안내 섹션

- 서비스를 어떻게 이용하면 되는지 안내합니다.
- 사용자가 입력해야 하는 정보와 결과 확인 방법을 설명합니다.

---

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
- 반응형 UI 적용
- 모바일 화면 지원

---

## AI 기능 설명

### 입력값

사용자는 아래 정보를 선택합니다.

- 날씨
- 컨디션
- 운동 가능 시간

### 출력값

AI는 선택된 정보를 바탕으로 아래 결과를 반환합니다.

```json
{
  "exercise": "추천 운동",
  "reason": "추천 이유",
  "caution": "주의사항",
  "routine": "추천 루틴"
}
```

### 사용자에게 제공하는 가치

사용자는 자신의 현재 상황에 맞는 운동을 빠르게 추천받을 수 있습니다.  
단순히 운동 이름만 알려주는 것이 아니라, 추천 이유와 주의사항, 구체적인 루틴까지 제공하여 실제로 운동을 시작하기 쉽게 도와줍니다.

---

## AI 기능 실패 처리 기준

VibeFit은 AI API 사용 중 발생할 수 있는 문제를 사용자에게 안내하기 위해 다음과 같은 실패 처리를 적용했습니다.

### 1. 필수 입력값 누락

사용자가 날씨, 컨디션, 운동 가능 시간을 선택하지 않은 경우 안내 메시지를 표시합니다.

예시:

```txt
날씨, 컨디션, 운동 시간을 선택해주세요.
```

### 2. API 오류 발생

Gemini API 요청 중 문제가 발생하면 사용자에게 다시 시도하라는 메시지를 보여줍니다.

예시:

```txt
운동 추천을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
```

### 3. AI 응답 파싱 실패

AI 응답이 JSON 형식에 맞지 않거나 결과가 잘린 경우 에러 메시지를 표시합니다.

예시:

```txt
추천 결과를 처리하는 중 문제가 발생했습니다.
```

---

## 사용 기술

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Vercel Serverless Function
- Node.js
- API endpoint: `/api/gemini`

### AI API

- Google Gemini API
- model: `gemini-3.6-flash`

### Deployment

- GitHub
- Vercel

---

## 프로젝트 구조

```txt
project-root
├── api
│   └── gemini.js
├── index.html
├── style.css
├── script.js
├── README.md
├── package.json
└── images
```

프론트엔드 파일과 백엔드 API 파일을 분리하여 구성했습니다.

- `index.html`: 웹페이지 구조
- `style.css`: 화면 디자인 및 반응형 스타일
- `script.js`: 사용자 입력 처리, 선택 제한, fetch 요청, 결과 출력
- `api/gemini.js`: Gemini API를 호출하는 Vercel Serverless Function
- `package.json`: 프로젝트 실행 및 의존성 관리

---

## 반응형 지원

VibeFit은 데스크톱과 모바일 환경에서 모두 사용할 수 있도록 반응형 CSS를 적용했습니다.

- 데스크톱에서는 넓은 화면에 맞춰 카드와 입력 영역이 보기 좋게 배치됩니다.
- 모바일에서는 버튼과 결과 영역이 세로 방향으로 정렬되어 작은 화면에서도 쉽게 사용할 수 있습니다.
- 최소 2가지 화면 크기에서 화면 깨짐 없이 동작하는지 확인했습니다.

---

## 보너스 기능: UX 고도화

VibeFit은 사용자 경험을 개선하기 위해 다음과 같은 UX 요소를 적용했습니다.

- 선택 버튼 클릭 시 활성화 상태 표시
- 운동 추천 요청 중 로딩 상태 안내
- 입력 누락 시 안내 메시지 표시
- API 오류 발생 시 사용자 친화적인 에러 메시지 제공
- AI 추천 결과를 구분된 카드 형태로 출력
- 모바일에서도 사용하기 쉬운 반응형 레이아웃 적용

이를 통해 보너스 과제 항목 중 사용자 경험 고도화 요소를 일부 반영했습니다.

---

## 환경 변수 설정

이 프로젝트는 Gemini API Key가 필요합니다.

Vercel 환경 변수에 아래 값을 등록해야 합니다.

```env
GEMINI_API_KEY=본인의_Gemini_API_KEY
```

### 환경 변수 등록 방법

1. Vercel에 로그인합니다.
2. 해당 프로젝트를 선택합니다.
3. `Settings` 메뉴로 이동합니다.
4. `Environment Variables` 메뉴를 선택합니다.
5. 이름에 `GEMINI_API_KEY`를 입력합니다.
6. 값에 본인의 Gemini API Key를 입력합니다.
7. 저장 후 프로젝트를 다시 배포합니다.

### 주의사항

- API Key는 절대 GitHub에 직접 올리면 안 됩니다.
- `.env` 파일을 사용하는 경우 `.gitignore`에 반드시 포함해야 합니다.
- API Key를 환경 변수로 관리하면 외부에 노출되지 않아 더 안전합니다.

---

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

---

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

서버리스 함수는 전달받은 데이터를 바탕으로 Gemini API에 요청을 보냅니다.  
Gemini API가 생성한 운동 추천 결과는 JSON 형식으로 프론트엔드에 반환되고, JavaScript가 이 응답을 화면에 출력합니다.

---

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

---

## 트러블슈팅

### 1. Gemini API 응답 파싱 오류

AI 응답에 코드블록이나 불필요한 문자가 포함되어 `JSON.parse()` 오류가 발생했습니다.

해결 방법:

- `responseMimeType: "application/json"` 적용
- `responseSchema` 적용
- 응답 문자열 정리 후 JSON 파싱
- 필수 항목 검증 코드 추가

---

### 2. 환경 변수 오류

Vercel에 `GEMINI_API_KEY`가 등록되지 않으면 API 요청이 실패합니다.

해결 방법:

1. Vercel Project Settings로 이동
2. Environment Variables 메뉴 선택
3. `GEMINI_API_KEY` 추가
4. 프로젝트 재배포

---

### 3. Gemini 응답이 중간에 잘리는 문제

AI 응답 길이가 부족하면 JSON 응답이 중간에 잘려 파싱 오류가 발생할 수 있습니다.

해결 방법:

```js
maxOutputTokens: 1500
```

위 설정을 통해 응답 길이를 충분히 확보했습니다.

---

### 4. 프론트엔드와 백엔드 통신 오류

프론트엔드에서 `/api/gemini`로 요청을 보내지만 서버리스 함수가 정상적으로 동작하지 않으면 오류가 발생할 수 있습니다.

해결 방법:

- `api/gemini.js` 파일 위치 확인
- Vercel 배포 상태 확인
- Network 탭에서 API 응답 확인
- 환경 변수 등록 여부 확인

---

### 5. API 요청 제한 오류

Gemini API 사용 중 요청이 많아지면 429 오류가 발생할 수 있습니다.

해결 방법:

- 짧은 시간 안에 반복 요청하지 않도록 주의
- 사용자에게 잠시 후 다시 시도하라는 메시지 표시
- 불필요한 중복 요청 방지

---

## 화면 예시

### 실행 화면

### 데스크톱 실행 화면

<img width="1888" height="905" alt="VibeFit01" src="https://github.com/user-attachments/assets/cd0e3b36-4cc2-456b-af13-1d5e4108e790" />

<img width="1897" height="898" alt="VibeFit02" src="https://github.com/user-attachments/assets/dd825385-a897-4bf8-a002-22c760994801" />

<img width="1893" height="910" alt="VibeFit03" src="https://github.com/user-attachments/assets/57047d7f-5b9b-4fd6-911c-8a66050a32d9" />

<img width="1903" height="899" alt="VibeFit04" src="https://github.com/user-attachments/assets/bc0971d3-3fff-458c-9f45-14babc9b6a46" />

---

##  스마트폰에서 실행 화면


| 스마트폰 실행 01 | 스마트폰 실행 02 |
|---|---|
| <img width="280" alt="스마트폰 실행01" src="https://github.com/user-attachments/assets/bf29383c-5ecb-4230-ac18-6add7be9cae3" /> | <img width="280" alt="스마트폰 실행02" src="https://github.com/user-attachments/assets/67b36069-13c4-457f-a8f4-3e1ad55c7e31" /> |

---


## 제출 증빙 자료

과제 제출 시 아래 자료를 함께 제출합니다.

### 서비스 스크린샷

- 데스크톱 화면
- 모바일 화면
- AI 운동 추천 결과 화면

### AI 코딩 도구 사용 증빙

- AI 코딩 도구와의 대화 화면 캡처
- 오류 해결 과정 캡처
- 코드 수정 또는 README 작성 도움을 받은 과정 캡처

---

## 배운 점

이번 프로젝트를 통해 다음 내용을 학습했습니다.

- HTML은 웹페이지의 구조를 담당한다는 점
- CSS는 화면 디자인과 반응형 레이아웃을 담당한다는 점
- JavaScript는 사용자 입력 처리와 API 요청, 화면 업데이트를 담당한다는 점
- 사용자 입력이 `fetch()` 요청으로 바뀌고, 응답 결과가 화면에 표시되는 흐름
- Vercel Serverless Function을 통해 프론트엔드와 백엔드를 분리하는 방법
- API Key를 환경 변수로 안전하게 관리해야 하는 이유
- 로컬 환경과 배포 환경의 차이
- GitHub와 Vercel을 활용한 배포 및 재배포 과정
- AI API 응답을 JSON 형식으로 안정적으로 처리하는 방법
- 오류가 발생했을 때 원인을 확인하고 수정하는 디버깅 과정

---

## 향후 개선 방향

- 추천 결과 저장 기능 추가
- 운동 난이도 선택 기능 추가
- 사용자 체력 수준 반영
- 모바일 UI 추가 개선
- 추천 결과 공유 기능 추가
- 운동 이미지 또는 영상 링크 제공
- 이전 추천 기록 확인 기능 추가
- 방문자 분석 기능 추가

---

## 개발자

- 개발자: leemin629
- GitHub: https://github.com/leemin629/2-3st-VSCode03

---

## 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.
