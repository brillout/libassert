# `@brillout/assert`

Assertion library that features:
- Readable assertion failure messages.
- Different assertion types.

The assertion types are:

- `assert` - Normal assertion
- `assert.internal` - The assertion fails because of an internal error.
- `assert.usage` - The assertion fails because of a wrong usage.
- `assert.warning` - The assertion fails but is not critical. Execution is not stopped and the program continues to run.

&nbsp;

<p align='center'>
<a href="#basic-usage">Basic Usage</a>
&nbsp; | &nbsp;
<a href="#assertinternal"><code>assert.internal</code></a>
&nbsp; | &nbsp;
<a href="#assertusage"><code>assert.usage</code></a>
&nbsp; | &nbsp;
<a href="#assert"><code>assert</code></a>
&nbsp; | &nbsp;
<a href="#assertwarning"><code>assert.warning</code></a>
</p>

<br/>

#### Basic Usage

~~~js
const assert = require('@brillout/assert'); // npm install @brillout/assert
// Or: `import assert from @brillout/assert`

function getAge(person) {
  assert(
    // The condition to assert:
    person.age && person.age>=0,
    // All the following arguments are error message that are printed when the condition fails:
    "The age of a person should be a positive number.",
    {person} // We print the person to know which user has a wrong age value.
  );
}
~~~

<br/>

#### `assert.internal`

Imagine that `person` in the example above
comes from a database that contains a rule ensuring
that `person.age` is always a positive number;
we expect `person.age` to be always a positive number.
This means that **we expect the assertion to not fail** and we use **`assert.internal`**:
if the assertion does fail then it's because we made a mistake in our thinking or there is a bug in our code;
the responsability is on our side.

~~~js
const assert = require('@brillout/assert');

// `person` comes from a database that ensures that `person.age` is always a positive number.
// We expect the assertion to always succeed and therefore use `assert.internal`.
function getAge(person) {
  assert.internal(
    person.age && person.age>=0,
    // We print `person` for debugging purposes, in case there is a bug and the assertion does fail.
    {person}
  );
}
~~~

The following is printed if `age===-1`:

~~~
****************************************
************* Stack Trace **************
****************************************
getAge (~/@brillout/assert/example/internal-error.js:6:10)
Object.<anonymous> (~/@brillout/assert/example/internal-error.js:3:1)


****************************************
************ Internal Error ************
****************************************
{
  "person": {
    "age": -1
  }
}
~~~

<br/>

#### `assert.usage`

If `person` comes from a user,
then the user may mistakenly set `person.age` to a negative number.
This means that **we expect that the assertion may fail** we use **`assert.usage`**:
if the assertion fails then it's because the user didn't properly use our program and
the responsability is on the side of the user.

~~~js
const assert = require('@brillout/assert');

function getAge(person) {
  assert.usage(
    person.age && person.age>=0,
    // We print a nice error message telling the user his mistake.
    'You should set `person.age` to a positive number.',
    'The person with the wrong age is:',
    {person}
  );
}
~~~

The following is printed if `age===-1`:

~~~
****************************************
************* Stack Trace **************
****************************************
getAge (~/@brillout/assert/example/wrong-usage.js:6:10)
Object.<anonymous> (~/@brillout/assert/example/wrong-usage.js:3:1)


****************************************
************* Wrong Usage **************
****************************************
You should set `person.age` to a positive number.
The person with the wrong age is:
{
  "person": {
    "name": "Luke Skywalker",
    "age": -1
  }
}
~~~

<br/>

#### `assert`

If you cannot know beforehand whether the assertion may fail because of an internal error or a wrong usage then use `assert`.

<br/>

#### `assert.warning`

If the error is not crictical then you can use `assert.warning` and the execution of the program will not stop: your program continues to run even if the assertion fails.

<br/>
<br/>
