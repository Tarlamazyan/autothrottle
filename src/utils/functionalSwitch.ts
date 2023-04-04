type ActionType<R> = Record<string, () => Promise<R>>;

export function functionalSwitch<R>(
  key: string,
  actions: ActionType<R>,
  defaultAction?: () => R | Promise<R>
): R | Promise<R> | undefined {
  if (key in actions) {
    return actions[key]();
  } else if (defaultAction) {
    return defaultAction();
  }
}
