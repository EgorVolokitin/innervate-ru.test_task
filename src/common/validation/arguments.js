import prettyPrint from '../utils/prettyPrint'

export function missingArgument(name) {
  throw new Error(`Missing argument '${name}'`);
}

export function invalidArgument(name, value) {
  throw new Error(`Invalid argument '${name}': ${prettyPrint(value)}`);
}
