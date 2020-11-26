import { getProjectInfo } from "./projectInfo";
import { cleanStackTrace } from "./manipulateStackTrace";

export { createError };

function createError(errMsg: string): Error {
  let errMsgLine = "";

  const { projectName } = getProjectInfo();
  if (projectName) {
    errMsgLine += `[${projectName}]`;
  }

  errMsgLine += errMsg;

  let err;
  {
    var stackTraceLimit__original = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    err = new Error(errMsgLine);
    Error.stackTraceLimit = stackTraceLimit__original;
  }

  cleanStackTrace(err);

  if (err.message.includes("\n")) {
    throw new Error(
      "Following assertion error message contains a new line character `\n` which is prohibited: " +
        err.message
    );
  }

  return err;
}
