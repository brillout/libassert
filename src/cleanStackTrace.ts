export { cleanStackTrace };

function cleanStackTrace(
  err: Error,
  numberOfStackTraceLinesToRemove: number
): void {
  err.stack = clean(err.stack, numberOfStackTraceLinesToRemove);
}

function clean(
  errStack: string | undefined,
  numberOfStackTraceLinesToRemove: number
): string | undefined {
  if (!errStack) {
    return errStack;
  }

  const stackLines = splitByLine(errStack);

  const stackLine__cleaned = stackLines
    .filter((line) => {
      // Remove internal stack traces
      if (line.includes(" (internal/")) {
        return false;
      }

      return true;
    })
    .slice(numberOfStackTraceLinesToRemove)
    .join("\n");

  return stackLine__cleaned;
}

function splitByLine(str: string): string[] {
  // https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
  return str.split(/\r?\n/);
}
