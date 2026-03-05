import type { Action, Direction } from "../../../shared/types/game";

export function randomBotAction(): Action {
  const actions: Action["type"][] = ["move", "shoot", "wait"];
  const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;
  const actionType = random(actions);

  if (actionType === "move") {
    const directions: Direction[] = ["up", "down", "left", "right"];
    return { type: "move", dir: random(directions) };
  }

  if (actionType === "shoot") {
    return { type: "shoot" };
  }

  return { type: "wait" };
}
