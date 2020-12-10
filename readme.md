Minimalistic & simple assertions for library authors.

Designed so that you can create all kinds of assertion types.

For example:

~~~ts
import { createError } from "@brillout/libassert";

export { assert, assertUsage, assertWarning };

const libName = "Awesome Library";

function assert(condition: unknown): asserts condition {
  if (condition) {
    return;
  }

  const err = createError({ prefix: `[${libName}][Internal Error] Something unexpected happened, please open a GitHub issue.` });

  throw err;
}

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
~~~

If your user calls `hello()` without arguments then `assertUsage` throws following error:

~~~
Error: [Awesome Library][Wrong Usage] Missing argument `name`.
    at main (/home/your-user/app/index.js:249:1)
~~~

Check the (tiny) source code for more information.
