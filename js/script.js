document.addEventListener("DOMContentLoaded", () => {
  const weatherButtons = document.querySelectorAll("#weatherOptions .option-btn");
  const moodButtons = document.querySelectorAll("#moodOptions .option-btn");
  const timeButtons = document.querySelectorAll("#timeOptions .option-btn");

  const recommendBtn = document.getElementById("recommendBtn");
  const loadingBox = document.getElementById("loadingBox");
  const resultBox = document.getElementById("resultBox");

  // 여러 개 선택 가능한 버튼 설정
  function setupMultipleSelect(buttons) {
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.toggle("active");
      });
    });
  }

  // 하나만 선택 가능한 버튼 설정
  function setupSingleSelect(buttons) {
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  // 선택된 값 가져오기
  function getSelectedValues(selector) {
    return Array.from(document.querySelectorAll(`${selector}.active`)).map(
      (button) => button.dataset.value
    );
  }

  // HTML 출력 시 안전하게 문자 처리
  function escapeHTML(text) {
    if (!text) return "";

    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // 에러 메시지 표시
  function showError(message) {
    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `
      <div class="error-box">
        ${escapeHTML(message)}
      </div>
    `;
  }

  // 결과 카드 표시
  function showResult(recommendation, selected) {
    const exercise = escapeHTML(recommendation.exercise);
    const reason = escapeHTML(recommendation.reason);
    const caution = escapeHTML(recommendation.caution);
    const routine = escapeHTML(recommendation.routine);

    const weather = escapeHTML(selected.weather);
    const mood = escapeHTML(selected.mood);
    const time = escapeHTML(selected.time);

    resultBox.classList.remove("hidden");

    resultBox.innerHTML = `
      <div class="result-card">
        <div class="result-header">
          <div class="result-icon">🏃</div>
          <div>
            <h3>AI 운동 추천 결과</h3>
          </div>
        </div>

        <div class="selected-info">
          <p><strong>선택한 날씨:</strong> ${weather}</p>
          <p><strong>선택한 컨디션:</strong> ${mood}</p>
          <p><strong>운동 가능 시간:</strong> ${time}</p>
        </div>

        <div class="result-grid">
          <div class="result-section exercise">
            <h4>추천 운동</h4>
            <p>${exercise}</p>
          </div>

          <div class="result-section reason">
            <h4>추천 이유</h4>
            <p>${reason}</p>
          </div>

          <div class="result-section caution">
            <h4>주의사항</h4>
            <p>${caution}</p>
          </div>

          <div class="result-section routine">
            <h4>추천 루틴</h4>
            <p>${routine}</p>
          </div>
        </div>
      </div>
    `;
  }

  setupMultipleSelect(weatherButtons);
  setupMultipleSelect(moodButtons);
  setupSingleSelect(timeButtons);

  recommendBtn.addEventListener("click", async () => {
    const selectedWeather = getSelectedValues("#weatherOptions .option-btn");
    const selectedMood = getSelectedValues("#moodOptions .option-btn");
    const selectedTimeButton = document.querySelector(
      "#timeOptions .option-btn.active"
    );

    const selectedTime = selectedTimeButton ? selectedTimeButton.dataset.value : "";

    if (selectedWeather.length === 0) {
      showError("오늘 날씨를 하나 이상 선택해주세요.");
      return;
    }

    if (selectedMood.length === 0) {
      showError("현재 기분이나 컨디션을 하나 이상 선택해주세요.");
      return;
    }

    if (!selectedTime) {
      showError("운동 가능 시간을 선택해주세요.");
      return;
    }

    try {
      resultBox.classList.add("hidden");
      resultBox.innerHTML = "";

      loadingBox.classList.remove("hidden");
      recommendBtn.disabled = true;
      recommendBtn.innerHTML = "<span>추천 생성 중...</span>";

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weather: selectedWeather,
          mood: selectedMood,
          time: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "운동 추천을 가져오지 못했습니다.");
      }

      showResult(data.recommendation, data.selected);
    } catch (error) {
      console.error(error);
      showError(
        "운동 추천 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      loadingBox.classList.add("hidden");
      recommendBtn.disabled = false;
      recommendBtn.innerHTML = "<span>AI 추천받기</span>";
    }
  });
});