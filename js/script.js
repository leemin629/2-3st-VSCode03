console.log("VibeFit JS 연결 성공!");

document.addEventListener("DOMContentLoaded", function () {
  const recommendBtn =
    document.getElementById("recommend-button") ||
    document.getElementById("recommendBtn");

  const message = document.getElementById("message");
  const result = document.getElementById("result");

  if (!recommendBtn) {
    console.error("추천받기 버튼을 찾을 수 없습니다.");
    return;
  }

  if (!result) {
    console.error("결과 출력 영역을 찾을 수 없습니다.");
    return;
  }

  // 체크박스 최대 2개 제한 함수
  function limitCheckboxSelection(name, label) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]`);

    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        const checkedItems = document.querySelectorAll(
          `input[name="${name}"]:checked`
        );

        if (checkedItems.length > 2) {
          checkbox.checked = false;

          if (message) {
            message.textContent = `${label}은 최대 2개까지만 선택할 수 있어요.`;
          }
        } else {
          if (message) {
            message.textContent = "";
          }
        }
      });
    });
  }

  limitCheckboxSelection("weather", "날씨");
  limitCheckboxSelection("mood", "기분/컨디션");

  // 추천받기 버튼 클릭 이벤트
  recommendBtn.addEventListener("click", function () {
    const selectedWeather = document.querySelectorAll(
      'input[name="weather"]:checked'
    );

    const selectedMood = document.querySelectorAll(
      'input[name="mood"]:checked'
    );

    const selectedTime = document.querySelector('input[name="time"]:checked');

    if (selectedWeather.length === 0) {
      result.innerHTML = `
        <h3>추천 결과</h3>
        <p>날씨를 최소 1개 이상 선택해주세요.</p>
      `;
      return;
    }

    if (selectedMood.length === 0) {
      result.innerHTML = `
        <h3>추천 결과</h3>
        <p>기분/컨디션을 최소 1개 이상 선택해주세요.</p>
      `;
      return;
    }

    if (!selectedTime) {
      result.innerHTML = `
        <h3>추천 결과</h3>
        <p>운동 가능 시간을 선택해주세요.</p>
      `;
      return;
    }

    const weatherValues = Array.from(selectedWeather).map(function (item) {
      return item.value;
    });

    const moodValues = Array.from(selectedMood).map(function (item) {
      return item.value;
    });

    const timeValue = selectedTime.value;

    let recommendation = "";

    if (
      weatherValues.includes("맑음") &&
      (moodValues.includes("상쾌함") || moodValues.includes("활력 넘침"))
    ) {
      recommendation = "오늘은 야외 러닝이나 빠르게 걷기를 추천해요!";
    } else if (
      weatherValues.includes("비") ||
      weatherValues.includes("눈") ||
      weatherValues.includes("미세먼지 나쁨")
    ) {
      recommendation = "오늘은 실내 홈트레이닝이나 스트레칭을 추천해요.";
    } else if (
      moodValues.includes("피곤함") ||
      moodValues.includes("무기력함")
    ) {
      recommendation = "오늘은 무리하지 말고 가벼운 스트레칭이나 요가를 추천해요.";
    } else if (moodValues.includes("스트레스 많음")) {
      recommendation = "스트레스 해소를 위해 산책이나 가벼운 유산소 운동을 추천해요.";
    } else if (moodValues.includes("활력 넘침")) {
      recommendation = "에너지가 좋은 날이에요! 근력 운동이나 인터벌 운동을 추천해요.";
    } else {
      recommendation = "오늘은 가벼운 전신 운동과 스트레칭을 추천해요.";
    }

    result.innerHTML = `
      <h3>추천 결과</h3>
      <p>선택한 날씨: ${weatherValues.join(", ")}</p>
      <p>선택한 기분/컨디션: ${moodValues.join(", ")}</p>
      <p>운동 가능 시간: ${timeValue}</p>
      <br>
      <p><strong>추천 운동:</strong> ${recommendation}</p>
    `;

    if (message) {
      message.textContent = "";
    }
  });
});