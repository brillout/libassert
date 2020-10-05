import { stringifyUnknown } from "./stringifyUnknown";
import { getProjectInfo } from "./projectInfo";
import { cleanStackTrace } from "./manipulateStackTrace";

export { createError };

function createError(errMsgs: unknown[], errMsgStart: string): Error {
  let errMsgLine = "";

  const { projectName } = getProjectInfo();
  if (projectName) {
    errMsgLine += `[${projectName}]`;
  }

  errMsgLine += errMsgStart + " ";

  const parts = [...errMsgs];
  parts
    .map(stringifyUnknown)
    .filter(Boolean)
    .forEach((errMsg, i) => {
      if (i !== 0 && errMsgLine !== "") {
        if (!errMsgLine.endsWith(".")) {
          errMsgLine += " | ";
        } else {
          errMsgLine += " ";
        }
      }
      errMsgLine += errMsg;
    });

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
