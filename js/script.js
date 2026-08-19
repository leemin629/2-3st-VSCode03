console.log("✅ script.js loaded v3");

document.addEventListener("DOMContentLoaded", () => {
  const weatherButtons = document.querySelectorAll("#weatherOptions .option-btn");
  const moodButtons = document.querySelectorAll("#moodOptions .option-btn");
  const timeButtons = document.querySelectorAll("#timeOptions .option-btn");

  const recommendBtn = document.getElementById("recommendBtn");
  const loadingBox = document.getElementById("loadingBox");
  const resultBox = document.getElementById("resultBox");

  // 최대 2개까지만 선택 가능한 버튼 설정
  function setupLimitedMultiSelect(buttons, maxCount, label) {
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const isActive = button.classList.contains("active");
        const activeButtons = Array.from(buttons).filter((btn) =>
          btn.classList.contains("active")
        );

        // 이미 선택된 버튼은 해제 가능
        if (isActive) {
          button.classList.remove("active");
          return;
        }

        // 새로 선택하려는데 이미 최대 개수면 막기
        if (activeButtons.length >= maxCount) {
          showError(`${label}은 최대 ${maxCount}개까지만 선택할 수 있습니다.`);
          return;
        }

        button.classList.add("active");
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
    if (text === null || text === undefined) return "";

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
    const exercise = escapeHTML(recommendation?.exercise || "추천 운동 정보 없음");
    const reason = escapeHTML(recommendation?.reason || "추천 이유 정보 없음");
    const caution = escapeHTML(recommendation?.caution || "주의사항 정보 없음");
    const routine = escapeHTML(recommendation?.routine || "추천 루틴 정보 없음");

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

  // 날씨, 컨디션은 최대 2개
  setupLimitedMultiSelect(weatherButtons, 2, "날씨");
  setupLimitedMultiSelect(moodButtons, 2, "컨디션");

  // 시간은 1개만
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

      const rawText = await response.text();

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (jsonError) {
        throw new Error(
          `서버가 JSON이 아닌 응답을 보냈습니다. 상태코드: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || `서버 오류가 발생했습니다. 상태코드: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || "AI 추천 생성에 실패했습니다.");
      }

      showResult(data.recommendation, {
        weather: selectedWeather.join(", "),
        mood: selectedMood.join(", "),
        time: selectedTime,
      });
    } catch (error) {
      console.error("추천 오류:", error);
      showError(`운동 추천 중 오류가 발생했습니다. ${error.message}`);
    } finally {
      loadingBox.classList.add("hidden");
      recommendBtn.disabled = false;
      recommendBtn.innerHTML = "<span>AI 추천받기</span>";
    }
  });
});