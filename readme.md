This is an old Readme and lot's of features are missing documentation.


I assail my code with assertions and sometimes an assertion is wrong while the code itself is fine.


For these cases I don't want assert to stop execution in production.


Still, an exception is thrown in a `setTimeout` so that error logging can still be used.


In dev (`window.location.hostname==='localhost'` or `process.env['NODE_ENV'] !== 'production'`) `require('reassert')` behaves like expected and stops execution.


Check the source code for more information, it's only couples of lines.
