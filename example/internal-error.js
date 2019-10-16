const assert = require('../');

getAge({age: -1});

function getAge(person) {
  assert.internal(
    person.age && person.age>=0,
    {person}
  );
}

