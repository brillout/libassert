import { createError } from "./createError";
import { getProjectInfo } from "./projectInfo";

export { assert };

function assert(condition: unknown): asserts condition {
  if (condition) {
    return;
  }

  const projectInfo = getProjectInfo();
  const { projectGithub } = projectInfo;

  let errMsg: string = `[Internal Error] Something unexpected happened.`;

  if (projectGithub) {
    errMsg += ` Please open a new issue at ${projectGithub}/issues/new and include this error stack.`;
  }

  const err = createError(errMsg);

  throw err;
}
