const assert = require('../');

getAge({age: -1});

function getAge(person) {
  assert.usage(
    person.age && person.age>=0,
    '`person.age` should be a positive number.',
    'The person with the wrong age is:',
    {person}
  );
}
