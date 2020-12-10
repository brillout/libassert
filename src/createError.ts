import { cleanStackTrace } from "./cleanStackTrace";

export { createError };

function createError({
  prefix,
  errorMessage,
}: {
  prefix: string;
  errorMessage?: string;
}): Error {
  let message = prefix;
  if (errorMessage) {
    message = `${message} ${errorMessage}`;
  }

  let err;
  {
    var stackTraceLimit__original = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    err = new Error(message);
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
