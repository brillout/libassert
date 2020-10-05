import { assert } from "./assert";
import { createError } from "./createError";
import { getProjectInfo } from "./projectInfo";

export { assertUsage };
export { getUsageError };

export type UsageError = Error & { _brand?: "UsageError" };
type Assertion = unknown;
type ErrMsgs = unknown[];

function assertUsage(assertion: Assertion, ...errMsgs: ErrMsgs): void {
  if (assertion) {
    return;
  }

  throw getUsageError(errMsgs);
}

function getUsageError(errMsgs: ErrMsgs, ...rest: unknown[]): UsageError {
  assert(rest.length === 0);

  const projectInfo = getProjectInfo();
  const { projectName } = projectInfo;

  let errMsgStart: string = `[wrong-usage] Wrong ${projectName} usage.`;

  const err = createError(errMsgs, errMsgStart);

  return err;
}
