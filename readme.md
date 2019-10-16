This assertion library is about:
- Printing assertion failure messages in a readable way.
- Having different assertion types.

The assertion types are:

- `assert` - Normal assertion
- `assert.internal` - The assertion fails because of an internal error.
- `assert.usage` - The assertion fails because of a wrong usage.
- `assert.warning` - The assertion fails but this is not critical. Execution is not stopped: the program continues to run.

What is the purpose of these assertion types?

Let's consider the following:

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

Now imagine that `person` comes from a database that contains a rule that `person.age` is always a positive number. In that case we certainly expect `person.age` to be a positive number and we should use `assert.internal`:

~~~js
const assert = require('@brillout/assert');

function getAge(person) {
  assert.internal(
    person.age && person.age>=0,
    // We still print
    {person}
  );
}
~~~

The following is printed if `age===-1`:

~~~
****************************************
************* Stack Trace **************
****************************************
at getAge (~/code/assert/example/internal-error.js:6:10)
at Object.<anonymous> (~/code/assert/example/internal-error.js:3:1)


****************************************
************ Internal Error ************
****************************************
{
  "person": {
    "age": -1
  }
}
~~~

But, if `person` comes from a user, then we expect that the user mistakenly sets the age to a negative number. This is something we expect and we should use `assert.usage`:

~~~js
const assert = require('@brillout/assert');

function getAge(person) {
  assert.usage(
    person.age && person.age>=0,
    // We print a nice error message telling the user his mistake.
    '`person.age` should be a positive number.',
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
    at getAge (/home/romu/code/assert/example/wrong-usage.js:6:10)
    at Object.<anonymous> (/home/romu/code/assert/example/wrong-usage.js:3:1)


****************************************
************* Wrong Usage **************
****************************************
`person.age` should be a positive number.
The person with the wrong age is:
{
  "person": {
    "age": -1
  }
}
~~~

If you cannot know beforehand whether the assertion may fail because of an internal error or a wrong usage then use `assert`.

If the error is not crictical then you can use `assert.warning` and the execution of the program will not stop: your program continues to run.
