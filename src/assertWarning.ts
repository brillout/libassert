import { createError } from "./createError";

export { assertWarning };

function assertWarning(condition: unknown, errorMessage: string): void {
  if (condition) {
    return;
  }

  let errMsg = `[Warning]`;
  if (errorMessage) {
    errMsg += " " + errorMessage;
  }

  const err = createError(errMsg);

  console.warn(err);
}
