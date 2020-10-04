import { stringifyUnknown } from "./stringifyUnknown";
import { getProjectInfo } from "./projectInfo";
import { cleanStackTrace } from "./manipulateStackTrace";

export { createError };

function createError(
  errMsgs: unknown[],
  errMsgStart: string,
  errMsgEnd?: string
): Error {
  let errMsgLine = "";

  const projectInfo = getProjectInfo();
  const { projectName } = projectInfo;
  if (projectName) {
    errMsgLine += `[${projectName}]`;
  }

  errMsgLine += errMsgStart;

  const msgJoiner = " | ";

  errMsgLine += errMsgs.map(stringifyUnknown).join(msgJoiner);

  if (errMsgEnd) {
    errMsgLine += msgJoiner + errMsgEnd;
  }

  let err;
  {
    var stackTraceLimit__original = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    err = new Error(errMsgLine);
    Error.stackTraceLimit = stackTraceLimit__original;
  }

  cleanStackTrace(err);

  return err;
}
