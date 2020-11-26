import { createError } from "./createError";

export { assertWarning };

function assertWarning(assertion: unknown, errorMessage: string): void {
  if (assertion) {
    return;
  }

  let errMsg = `[Warning]`;
  if (errorMessage) {
    errMsg += " " + errorMessage;
  }

  const err = createError(errMsg);

  console.warn(err);
}
