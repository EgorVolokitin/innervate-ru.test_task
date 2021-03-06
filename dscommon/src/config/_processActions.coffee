Result = require '../result'

sortedMap = require '../sortedMap'

{compile: compileTags} = require '../tags'

processActions = (result, doc) ->

  unless doc.$$src.hasOwnProperty('actions')

    return { # processActions =

      $$list: []

      $$tags: {}}

  result.context (Result.prop 'actions'), -> # processActions =

    res = sortedMap result, doc.$$src.actions, index: true

    , getValue: (result, value, res) ->

      if typeof value == 'function'

        # TODO: Check number of parameters in given function

        res.value = value

        return true

      false

    unless result.isError

      action = undefined

      result.context ((path) -> (Result.item action.name) path), ->

        for action in res.$$list when action.hasOwnProperty('$$src')

          unless action.$$src.hasOwnProperty('value')

            result.error 'dsc.missingProp', value: 'value'

          else unless typeof action.$$src.value == 'function'

            result.error 'dsc.invalidValue', value: action.$$src.value

          else

            # TODO: Check number of parameters in given function

            action.value = action.$$src.value

        return # result.context

      compileTags result, res

      sortedMap.finish result, res, skipProps: ['tags']

      res unless result.isError # processActions =

# ----------------------------

module.exports = processActions