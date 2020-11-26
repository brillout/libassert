Minimalistic & simple assertions for library authors.

For example:

~~~js
import { assertUsage, setProjectInfo } from @brillout/libassert;

export { hello };

setProjectInfo({
  projectName: 'Awesome Library',
});

function hello(name) {
  assertUsage(name, "Missing argument `name`.");
}
~~~

If your user calls `hello()` without arguments then `assertUsage` throws following error:

~~~
Error: [Awesome Library][Wrong Usage] Missing argument `name`.
    at main (/home/your-user/app/index.js:249:1)
~~~

Check the (small) source code for more information.
