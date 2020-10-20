export { cleanStackTrace };

function cleanStackTrace(err: Error): void {
  err.stack = clean(err.stack);
}

function clean(errStack: string | undefined): string | undefined {
  if (!errStack) {
    return errStack;
  }

  const errStackCleaned = splitByLine(errStack)
    .filter((line) => {
      // Remove stack traces related to this package
      if (/@brillout.assert/.test(line)) {
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

function splitByLine(str: string): string[] {
  // https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
  return str.split(/\r?\n/);
}
