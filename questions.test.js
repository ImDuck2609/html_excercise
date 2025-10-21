/**
 * @jest-environment jsdom
 */

const { loadQuestions } = require("./questions");

beforeEach(() => {
  // Reset DOM before each test
  document.body.innerHTML = `
    <div id="state"></div>
    <div id="questions-list"></div>
  `;

  // Mock fetch
  global.fetch = jest.fn();
});

describe("loadQuestions", () => {
  test("displays 'Loading...' while fetching", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const state = document.getElementById("state");
    const list = document.getElementById("questions-list");

    const promise = loadQuestions();

    // Immediately after calling, should show loading
    expect(state.textContent).toBe("Loading...");
    expect(list.innerHTML).toBe("");

    await promise;
  });

  test("renders questions when data is available", async () => {
    const mockData = [
      {
        prompt: "What is 2 + 2?",
        options: [
          { id: "A", text: "3" },
          { id: "B", text: "4" },
        ],
      },
    ];

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    await loadQuestions();

    const state = document.getElementById("state");
    const list = document.getElementById("questions-list");

    expect(state.textContent).toBe("");
    expect(list.querySelectorAll(".question-item").length).toBe(1);
    expect(list.innerHTML).toContain("What is 2 + 2?");
    expect(list.innerHTML).toContain("B. 4");
  });

  test("shows 'No questions available.' when data is empty", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await loadQuestions();

    const state = document.getElementById("state");
    expect(state.textContent).toBe("No questions available.");
  });

  test("shows error message when fetch fails (not ok)", async () => {
    fetch.mockResolvedValue({ ok: false });

    await loadQuestions();

    const state = document.getElementById("state");
    expect(state.textContent).toBe("Error: Network error");
  });

  test("shows error message when fetch throws exception", async () => {
    fetch.mockRejectedValue(new Error("Server down"));

    await loadQuestions();

    const state = document.getElementById("state");
    expect(state.textContent).toBe("Error: Server down");
  });
});
