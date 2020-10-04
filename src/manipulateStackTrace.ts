export { cleanStackTrace };

function cleanStackTrace(err: Error): void {
  err.stack = clean(err.stack);
}

function clean(errStack: string | undefined): string | undefined {
  if (!errStack) {
    return errStack;
  }

  const linesFiltered = [];
  const lines = errStack.split("\n");
  lines.reverse();
  for (var i in lines) {
    var line = lines[i];

    // Remove stack traces related to this package
    if (line.indexOf("/node_modules/@brillout/assert/") !== -1) {
      break;
    }

    // Remove useless stack traces
    if (line.indexOf(" (internal/") !== -1) {
      continue;
    }
    if (line === "Error") {
      continue;
    }

    linesFiltered.push(line);
  }
  linesFiltered.reverse();

  const errStackCleaned = linesFiltered.join("\n");

  return errStackCleaned;
}
