import { createError } from "./createError";
import { getProjectInfo } from "./projectInfo";

export { assert };

function assert(assertion: unknown, ...errMsgs: unknown[]): void {
  if (assertion) {
    return;
  }

  const projectInfo = getProjectInfo();
  const { projectGithub } = projectInfo;

  let errMsgStart: string = `[internal-error] Something unexpected happened.`;

  if (projectGithub) {
    errMsgStart += `Please open a ticket at ${projectGithub}/issues/new.`;
  }

  const err = createError(errMsgs, errMsgStart);

  throw err;
}
