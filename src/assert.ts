import { createError } from "./createError";
import { getProjectInfo } from "./projectInfo";

export { assert };

function assert(assertion: unknown): void {
  if (assertion) {
    return;
  }

  const projectInfo = getProjectInfo();
  const { projectGithub } = projectInfo;

  let errMsg: string = `[Internal Error] Something unexpected happened.`;

  if (projectGithub) {
    errMsg += ` Please open a new issue at ${projectGithub}/issues/new.`;
  }

  const err = createError(errMsg);

  throw err;
}
