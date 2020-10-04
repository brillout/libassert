import { createError } from "./createError";
import { getProjectInfo } from "./projectInfo";

export { assertUsage };

function assertUsage(assertion: unknown, ...errMsgs: unknown[]): void {
  if (assertion) {
    return;
  }

  const projectInfo = getProjectInfo();
  const { projectDocs, projectName } = projectInfo;

  let errMsgStart: string = `[wrong-usage] Wrong \`${projectName}\` usage.`;

  let errMsgEnd: string | undefined;
  if (projectDocs) {
    errMsgEnd = `Check out the docs at ${projectDocs}.`;
  }

  const err = createError(errMsgs, errMsgStart, errMsgEnd);

  throw err;
}
