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
- 날씨, 기분/컨디션, 운동 가능 시간을 반드시 반영하세요.
- 컨디션이 좋고 시간이 충분하면 걷기나 스트레칭만 추천하지 말고 활동적인 운동을 추천하세요.
- 날씨가 더우면 실내 자전거, 실내 유산소, 맨몸 근력 운동, 전신 서킷 트레이닝을 우선 추천하세요.
- 날씨가 좋으면 야외 운동을 적극 추천할 수 있습니다.
- 날씨가 나쁘거나 미세먼지, 비, 추위, 더위가 있으면 실내 운동을 추천하세요.
- 무리한 운동은 권하지 말고 안전한 강도로 추천하세요.
- routine에는 준비운동, 본운동, 마무리운동을 포함하세요.

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

응답 규칙:
- 반드시 JSON 객체 하나만 응답하세요.
- exercise, reason, caution, routine 네 개의 key만 사용하세요.
- 모든 값은 한국어 한 줄 문자열로 작성하세요.
- markdown, 코드블록, 번호 목록, 불필요한 설명은 넣지 마세요.
- 각 값은 너무 길지 않게 작성하세요..


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
            temperature: 0.2,
            maxOutputTokens: 1500,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                exercise: { type: "STRING" },
                reason: { type: "STRING" },
                caution: { type: "STRING" },
                routine: { type: "STRING" },
              },
              required: ["exercise", "reason", "caution", "routine"],
            },
          }
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

    const candidate = data?.candidates?.[0];

    console.log("Gemini finishReason:", candidate?.finishReason);
    console.log("Gemini raw text:", text);

    if (!text) {
      return res.status(500).json({
        success: false,
        message: "Gemini로부터 응답을 받지 못했습니다.",
      });
    }

    let recommendation;

try {
  let cleanedText = text.trim();

  cleanedText = cleanedText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  if (cleanedText.startsWith("(") && cleanedText.endsWith(")")) {
    cleanedText = cleanedText.slice(1, -1).trim();
  }

  recommendation = JSON.parse(cleanedText);

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
    message: "Gemini 응답을 JSON으로 변환하지 못했습니다.",
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