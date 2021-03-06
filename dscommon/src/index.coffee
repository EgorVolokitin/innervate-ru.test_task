# В процессе работы со спецификациями обнаружил проблему, что загружаемые файлы рассинхронизируются, из-за того
# что jasmine на регулярной основе сбрасывает require.cache.  Как пример: возникла проблема с проверкой
# `result instanceof Result` в loader, если Result объект создается в коде спецификаций.  Объединение загружаемых
# частей в единый загрузочный файл - проблему решило.
#
# UPD: Тем не менее даже этот подход не решил проблему - потому вместо instanceof, делаем методы типа err.isResult

require './polyfills'

module.exports =

  Result: require './result'

  BitArray: require './bitArray'

  Reporter: require './reporter'

  loader: require './loader'

  i18n: require './i18n'

  utils: require './utils'

  types: require './types'

  tags: require './tags'

  config: require './config'

  sortedMap: require './sortedMap'

  flatMap: require './flatMap'

  compareStructures: require './compareStructures'

  # docs: require './docs'

module.exports.default = module.exports