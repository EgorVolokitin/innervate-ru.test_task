// TODO: Заменить во всем коде utils/arguments на /validation и удалить этот файл

import prettyPrint from './prettyPrint'

export function missingArgument(name) {
  throw new Error(`Missing argument '${name}'`);
}

export function invalidArgument(name, value) {
  throw new Error(`Invalid argument '${name}': ${prettyPrint(value)}`);
}
