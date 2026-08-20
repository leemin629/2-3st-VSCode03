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

    const { weather, mood, time } = req.body;

    if (!weather || !mood || !time) {
      return res.status(400).json({
        success: false,
        message: "날씨, 기분/컨디션, 운동 가능 시간을 모두 선택해주세요.",
      });
    }

    const weatherText = Array.isArray(weather) ? weather.join(", ") : weather;
    const moodText = Array.isArray(mood) ? mood.join(", ") : mood;

    const prompt = `
당신은 사용자의 날씨, 기분/컨디션, 운동 가능 시간을 바탕으로 안전하고 적절한 운동을 추천하는 AI 피트니스 코치입니다.

사용자 정보:
- 선택한 날씨: ${weatherText}
- 선택한 기분/컨디션: ${moodText}
- 운동 가능 시간: ${time}

반드시 아래 JSON 형식으로만 답변하세요.
마크다운 코드블록은 사용하지 마세요.
설명 문장 없이 JSON만 반환하세요.

{
  "exercise": "추천 운동 이름",
  "reason": "이 운동을 추천하는 이유",
  "caution": "운동할 때 주의사항",
  "routine": "운동 가능 시간에 맞춘 간단한 운동 루틴"
}

조건:
- 한국어로 작성하세요.
- 초보자도 이해하기 쉽게 작성하세요.
- 날씨, 기분/컨디션, 운동 시간을 반드시 반영하세요.
- 무리한 운동은 권하지 마세요.
- 주의사항에는 안전, 컨디션 관리, 준비운동 관련 내용을 포함하세요.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
      console.error("Gemini API Error:", data);

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
        .trim();

      recommendation = JSON.parse(cleanedText);
    } catch (error) {
      console.error("JSON Parse Error:", error);
      console.error("Original Gemini Text:", text);

      recommendation = {
        exercise: "가벼운 걷기 또는 스트레칭",
        reason:
          "현재 선택한 상태를 기준으로 무리하지 않고 몸을 천천히 움직이는 운동이 적합합니다.",
        caution:
          "운동 전후로 스트레칭을 하고, 몸 상태가 좋지 않으면 즉시 휴식을 취하세요.",
        routine:
          "5분 준비운동 → 20~30분 가벼운 운동 → 5~10분 마무리 스트레칭",
      };
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