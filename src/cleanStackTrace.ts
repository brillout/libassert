export { cleanStackTrace };

function cleanStackTrace(err: Error): void {
  err.stack = clean(err.stack);
}

function clean(errStack: string | undefined): string | undefined {
  if (!errStack) {
    return errStack;
  }

  const stackLines = splitByLine(errStack);

  const stackLine__cleaned = stackLines
    .filter((line, i) => {
      // Remove stack traces related to this package
      if (isSelf(line)) {
        return false;
      }

      // Remove the definition of the assert function
      const previousLine = stackLines[i - 1];
      if (isSelf(previousLine)) {
        return false;
      }

      // Remove internal stack traces
      if (line.includes(" (internal/")) {
        return false;
      }

      return true;
    })
    .join("\n");

  return stackLine__cleaned;
}

function isSelf(stackLine: string): boolean {
  return /@brillout.libassert/.test(stackLine);
}

function splitByLine(str: string): string[] {
  // https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
  return str.split(/\r?\n/);
}
