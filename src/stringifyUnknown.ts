export { stringifyUnknown };

function stringifyUnknown(thing: unknown): string {
  if( thing === undefined ){
    return 'undefined';
  }
  if( (thing as string)?.constructor===String ) {
    return (thing as string);
  }
  return JSON.stringify(thing);
}
