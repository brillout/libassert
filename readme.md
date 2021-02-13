# `@brillout/libassert`

Tiny zero-dependency tool for library authors to create assertion functions with clean strack traces.

- Complete stack traces. (`Error.stackTraceLimit = Infinity;` _only_ for assertion errors.)
- Cleaned stack traces. (Fist stack line points to the assertion breaking code, useless stack lines are stripped away.)
- Error messages are guaranteed to not contain new lines.

```ts
import { createError } from "@brillout/libassert";

export { assert };

function assert(condition: unknown): asserts condition {
  if (condition) {
    return;
  }

  const prefix =
    `[My Awesome Library][Internal Error] Something unexpected happened, ` +
    `please open a GitHub issue.`;
  const err = createError({ prefix });

  throw err;
}
```

Calling `createError(errorMessage)` is the same than `new Error(${prefix} ${errorMessage})` except that:

- `prefix` and `errorMessage` are forbidden to contain new lines.
- The stack trace is complete and cleaned as described above.

You can create all kinds of assertion functions, such as `assertUsage` or `assertWarning`:

```ts
import { createError } from "@brillout/libassert";

export { assert, assertUsage, assertWarning };

const libName = "My Awesome Library";

// Assertions that are expected to always be true (also known as "invariants")
function assert(condition: unknown): asserts condition {
  if (condition) {
    return;
  }

  const prefix =
    `[${libName}][Internal Error] Something unexpected happened, ` +
    `please open a GitHub issue.`;
  const err = createError({ prefix });

  throw err;
}

// Wrong usage of your library
function assertUsage(
  condition: unknown,
  errorMessage: string
): asserts condition {
  if (condition) {
    return;
  }

  const err = createError({
    prefix: `[${libName}][Wrong Usage]`,
    errorMessage,
  });

  throw err;
}

// Something unexpected happened but it is non-critical and doesn't
// warrant interrupting code execution.
function assertWarning(condition: unknown, errorMessage: string): void {
  if (condition) {
    return;
  }

  const err = createError({
    prefix: `[${libName}][Warning]`,
    errorMessage,
  });

  console.warn(err);
}
```
