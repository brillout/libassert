import { createError } from "./createError";
import { getProjectInfo } from "./projectInfo";

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
  const projectInfo = getProjectInfo();
  const { projectName } = projectInfo;

  let errMsg = `[Wrong Usage] Wrong ${projectName} usage.`;
  if (errorMessage) {
    errMsg += " " + errorMessage;
  }

  const err = createError(errMsg);

  return err;
}
