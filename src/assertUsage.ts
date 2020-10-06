import { createError } from "./createError";

export { assertUsage };
export { getUsageError };

export type UsageError = Error & { _brand?: "UsageError" };

function assertUsage(assertion: unknown, errorMessage: string): void {
  if (assertion) {
    return;
  }

  throw getUsageError(errorMessage);
}

function getUsageError(errorMessage: string): UsageError {
  let errMsg = `[Wrong Usage]`;
  if (errorMessage) {
    errMsg += " " + errorMessage;
  }

  const err = createError(errMsg);

  return err;
}
