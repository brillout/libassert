import { createError } from "./createError";

export { assertWarning };

function assertWarning(
  condition: unknown,
  errorMessage: string
): asserts condition {
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
