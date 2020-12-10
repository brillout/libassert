export { cleanStackTrace };

function cleanStackTrace(err: Error): void {
  err.stack = clean(err.stack);
}

function clean(errStack: string | undefined): string | undefined {
  if (!errStack) {
    return errStack;
  }

  const stackLines = splitByLine(errStack);

  const sackLines__cleaned = stackLines
    .filter((line, i) => {
      // Remove stack traces related to this package
      if (isSelf(line)) {
        return false;
      }

      // Remove the file that defines the assertion function from the stack trace
      if (isSelf(stackLines[i + 1])) {
        return false;
      }

      // Remove internal stack traces
      if (line.includes(" (internal/")) {
        return false;
      }

      return true;
    })
    .join("\n");

  return sackLines__cleaned;
}

function isSelf(stackLine: string): boolean {
  return /@brillout.libassert/.test(stackLine);
}

function splitByLine(str: string): string[] {
  // https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
  return str.split(/\r?\n/);
}
