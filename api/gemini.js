export default async function handler(req, res) {
  // CORS 및 OPTIONS 요청 처리
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "POST 요청만 허용됩니다.",
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY 환경변수가 설정되지 않았습니다.",
      });
    }

  const { weather, mood, condition, time } = req.body;

  const selectedMood = mood || condition;

  if (!weather || !selectedMood || !time) {
      return res.status(400).json({
        success: false,
        message: "날씨, 기분/컨디션, 운동 가능 시간을 모두 선택해주세요.",
     });
  }

  const weatherText = Array.isArray(weather) ? weather.join(", ") : weather;
  const moodText = Array.isArray(selectedMood)
    ? selectedMood.join(", ")
    : selectedMood;  

    const prompt = `
당신은 사용자의 날씨, 기분/컨디션, 운동 가능 시간을 바탕으로 적절한 운동을 추천하는 전문 AI 피트니스 코치입니다.

사용자 정보:
- 선택한 날씨: ${weatherText}
- 선택한 기분/컨디션: ${moodText}
- 운동 가능 시간: ${time}

중요한 추천 규칙:
- 특별히 컨디션이 나쁘지 않다면 "가벼운 걷기"나 "스트레칭"만 메인 운동으로 추천하지 마세요.
- 걷기와 스트레칭은 준비 운동이나 마무리 운동으로만 활용하세요.
- 날씨, 기분/컨디션, 운동 가능 시간을 반드시 반영해서 추천하세요.
- 컨디션이 좋고 시간이 충분하면 조깅, 자전거, 근력 운동, 서킷 트레이닝처럼 조금 더 활동적인 운동을 추천하세요.
- 사용자의 컨디션이 "상쾌함", "활력 넘침"이고 운동 시간이 60분 이상이면, "가벼운 걷기" 또는 "스트레칭"을 메인 운동으로 추천하지 마세요. 이 경우 실내 유산소, 근력 운동, 자전거, 서킷 트레이닝, 조깅 중 하나를 메인 운동으로 추천하세요.
- 날씨가 좋으면 야외 운동을 적극적으로 추천하세요.
- 날씨가 더운 경우에는 야외 걷기보다 실내 자전거, 실내 유산소, 맨몸 근력 운동, 전신 서킷 트레이닝을 우선 추천하세요.
- 날씨가 나쁘거나 미세먼지/비/추위/더위가 있다면 실내 운동을 추천하세요.
- 운동 시간이 짧으면 짧고 효율적인 루틴을 추천하세요.
- 운동 시간이 길면 준비 운동, 본 운동, 마무리 운동을 포함한 루틴을 추천하세요.
- 무리한 운동은 권하지 말고, 안전한 강도로 추천하세요.
- 컨디션이 좋으면 활동적인 운동도 추천하세요.

추천 가능한 메인 운동 예시:
- 조깅
- 자전거
- 인터벌 러닝
- 홈트레이닝
- 맨몸 근력 운동
- 코어 운동
- 줄넘기
- 실내 유산소
- 전신 서킷 트레이닝
- 요가
- 필라테스
- 가벼운 등산
- 계단 오르기

아래 조건을 반드시 지켜서 응답하세요.

1. 반드시 JSON 객체 하나만 응답하세요.
2. 설명 문장, markdown, 코드블록, \`\`\`json 표시를 절대 넣지 마세요.
3. JSON 밖에는 어떤 글자도 쓰지 마세요.
4. 모든 값은 한 줄 문자열로 작성하세요.
5. 문자열 안에 줄바꿈을 넣지 마세요.
6. #, -, *, 번호 목록 같은 markdown 기호를 사용하지 마세요.
7. 아래 4개 key만 사용하세요: exercise, reason, caution, routine
8. 응답은 반드시 한 줄짜리 JSON 객체로만 작성하세요.
9. JSON 문법에 필요한 key와 value의 큰따옴표는 반드시 사용하세요.
10. 단, value 문자열 내부에는 추가 큰따옴표를 넣지 마세요.


응답 형식은 반드시 아래와 같은 한 줄 JSON이어야 합니다.


{
  "exercise": "추천 운동 이름",
  "reason": "이 운동을 추천하는 이유",
  "caution": "운동할 때 주의사항",
  "routine": "운동 가능 시간에 맞춘 간단한 운동 루틴"
}

조건:
- 한국어로 작성하세요.
- 초보자도 이해하기 쉽게 작성하세요.
- 답변은 너무 길지 않게 작성하세요.
- 추천 운동 이름은 하나의 메인 운동이 분명하게 드러나게 작성하세요.
- routine에는 준비운동, 본운동, 마무리운동을 가능하면 포함하세요.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 700,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Message:", data?.error?.message);
      console.error("Gemini API Full Error:", JSON.stringify(data, null, 2));  

      return res.status(response.status).json({
        success: false,
        message: "Gemini API 요청 중 오류가 발생했습니다.",
        detail: data,
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    if (!text) {
      return res.status(500).json({
        success: false,
        message: "Gemini로부터 응답을 받지 못했습니다.",
      });
    }

    let recommendation;

try {
  const cleanedText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/#/g, '"')
    .trim();

  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Gemini 응답에서 JSON 형식을 찾지 못했습니다.");
  }

  recommendation = JSON.parse(jsonMatch[0]);

  if (
    !recommendation.exercise ||
    !recommendation.reason ||
    !recommendation.caution ||
    !recommendation.routine
  ) {
    throw new Error("추천 결과에 필요한 항목이 부족합니다.");
  }
} catch (error) {
  console.error("JSON Parse Error:", error);
  console.error("Original Gemini Text:", text);

  return res.status(500).json({
    success: false,
    message: "AI 응답을 JSON으로 변환하지 못했습니다.",
    originalText: text,
  });
}

    return res.status(200).json({
      success: true,
      recommendation,
      selected: {
        weather: weatherText,
        mood: moodText,
        time,
      },
    });
  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      success: false,
      message: "서버에서 오류가 발생했습니다.",
    });
  }
}