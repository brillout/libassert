import { cleanStackTrace } from "./cleanStackTrace";

export { newError };

function newError(
  errorMessage: string,
  numberOfStackTraceLinesToRemove: number
) {
  if (errorMessage.includes("\n")) {
    throw new Error(
      "Following error message contains a new line character `\n` which is prohibited: " +
        errorMessage
    );
  }

  let err;
  {
    var stackTraceLimit__original = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    err = new Error(errorMessage);
    Error.stackTraceLimit = stackTraceLimit__original;
  }

  cleanStackTrace(err, numberOfStackTraceLinesToRemove);

  return err;
}
