import { describe, expect, test } from "vitest";
import { createPinia } from "pinia";
import { nextTick } from "vue";
import { render } from "vitest-browser-vue";
import App from "../app/app.vue";
import { useGameStore } from "../app/stores/game-store";

describe("game app browser flow", () => {
  test("renders two boards and shows movement controls only on player board", async () => {
    const pinia = createPinia();
    const { getByText, container } = render(App, {
      global: { plugins: [pinia] },
    });

    await expect.element(getByText("Поле игрока")).toBeInTheDocument();
    await expect.element(getByText("Поле противника")).toBeInTheDocument();

    expect(container.querySelectorAll('[data-testid^="move-player-"]').length).toBe(4);
    expect(container.querySelectorAll('[data-testid^="move-enemy-"]').length).toBe(0);
  });

  test("disables action buttons while enemy is thinking", async () => {
    const pinia = createPinia();
    const { getByRole } = render(App, {
      global: { plugins: [pinia] },
    });
    const store = useGameStore(pinia);

    store.state.characters.enemy.status.isThinking = true;
    await nextTick();

    await expect.element(getByRole("button", { name: "Выстрел" })).toBeDisabled();
    await expect.element(getByRole("button", { name: "Пропуск" })).toBeDisabled();
    await expect.element(getByRole("button", { name: "Рестарт" })).toBeEnabled();
  });
});
