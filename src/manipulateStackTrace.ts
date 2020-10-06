export { cleanStackTrace };

function cleanStackTrace(err: Error): void {
  err.stack = clean(err.stack);
}

function clean(errStack: string | undefined): string | undefined {
  if (!errStack) {
    return errStack;
  }

  const errStackCleaned = errStack
    .split("\n")
    .filter((line, i) => {
      // Is not a stack trace line, e.g. the error message.
      if (!line.startsWith("    at")) {
        return true;
      }

      // Remove stack traces related to this package
      /*
      if (line.includes("/node_modules/@brillout/assert/")) {
        return false;
      }
      */
      if (line.startsWith("    at Object.createError") && i === 1) {
        return false;
      }
      if (line.startsWith("    at Object.assert") && i === 2) {
        return false;
      }

      // Remove useless internal stack traces
      if (line.includes(" (internal/")) {
        return false;
      }

      return true;
    })
    .join("\n");

  return errStackCleaned;
}
