async function loadQuestions() {
  const state = document.getElementById("state");
  const list = document.getElementById("questions-list");

  if (!state || !list) return;

  state.textContent = "Loading...";
  list.innerHTML = "";

  try {
    const res = await fetch("questions.json");

    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    if (data.length === 0) {
      state.textContent = "No questions available.";
      return;
    }

    state.textContent = "";
    data.forEach((q) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="question-item">
          <h3>${q.prompt}</h3>
          <div class="options">
            ${q.options
              .map(
                (option) => `
                <label>
                  <input type="radio" name="answer-${q.id}" value="${option.id}">
                  &nbsp ${option.id}. ${option.text}
                </label>`
              )
              .join("")}
          </div>
        </div>`;
      list.appendChild(div);
    });
  } catch (err) {
    state.textContent = `Error: ${err.message}`;
  }
}

if (typeof window !== "undefined") {
  loadQuestions();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { loadQuestions };
}
