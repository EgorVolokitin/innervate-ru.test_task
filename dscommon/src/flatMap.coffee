Result = require './result'

sortedMap = require './sortedMap'

BitArray = require './bitArray'

{deepClone, err: {invalidArg, invalidArgValue, isResult}} = require './utils'

finish = (result, resValue, subitemsField, opts) ->

  invalidArg 'result', result unless isResult result
  invalidArg 'resValue', resValue unless typeof resValue == 'object' && resValue != null && resValue.hasOwnProperty('$$flat')
  invalidArg 'subitemsField', subitemsField unless typeof subitemsField == 'string' && subitemsField.length > 0
  invalidArg 'opts', opts unless opts == undefined || (typeof opts == 'object' && opts != null && !Array.isArray(opts))

  _processSublevel = (level) ->

    item = undefined

    result.context ((path) -> (Result.item item.name) path), -> # _processSublevel =

      for item in level.$$list

        if item.hasOwnProperty(subitemsField)

          result.context (Result.prop subitemsField), ->

            _processSublevel item[subitemsField]

            sortedMap.finish result, item[subitemsField], opts

            return # result.context

      return # result.context

    return # _processLevel

  _processSublevel resValue

  sortedMap.finish result, resValue, opts

  return # finish =

flatMap = (result, value, subitemsField, opts) ->

  invalidArg 'result', result unless isResult result
  invalidArg 'subitemsField', subitemsField unless typeof subitemsField == 'string' && subitemsField.length > 0
  invalidArg 'opts', opts unless opts == undefined || (typeof opts == 'object' && opts != null && !Array.isArray(opts))

  unless opts?.hasOwnProperty('index') # true - add to every result item $$index, with the index of item within result $$list

    optsIndex = false

  else

    invalidArgValue 'opts.index', opts.index unless typeof (optsIndex = opts.index) == 'boolean'

    if optsIndex

      opts = deepClone opts

      opts.index = false # turn indexing off for sortedMap()

  unless opts?.hasOwnProperty('mask') # true - val could be list of masks or a comma delimited mask

    optsMask = false

  else

    invalidArgValue 'opts.mask', opts.mask unless typeof (optsMask = opts.mask) == 'boolean'

    throw new Error 'opts.mask requires opts.index to be true' unless optsIndex

  name = []

  resList = []

  resMap = {}

  _processLevel = (parentItem) ->

    for item in parentItem.$$list

      item.$$index = resList.length if optsIndex

      resList.push item

      name.push item.name

      resMap[name.join '.'] = item

      if item.$$src?.hasOwnProperty(subitemsField)

        result.context (Result.item item.name, Result.prop(subitemsField)), ->

          item[subitemsField] = resLevel = sortedMap result, item.$$src[subitemsField], opts

          _processLevel resLevel unless result.isError # result.context

          return # result.context

      name.pop()

    return # _processLevel =

  result.context -> # flatMask

    res = sortedMap result, value, opts

    unless result.isError

      _processLevel res

      unless result.isError

        (res.$$flat = resMap).$$list = resList

        if optsMask

          masks = []

          buildMask = (list) ->

            for item in list

              v.set item.$$index for v in masks

              if item.hasOwnProperty(subitemsField)

                masks.push item.$$mask = mask = new BitArray res

                buildMask item[subitemsField].$$list

                masks.pop()

            return # buildMask =

          buildMask res.$$list

        res # result.context

# ----------------------------

module.exports = flatMap

flatMap.finish = finish

flatMap.empty =

  $$list: []

  $$flat:

    $$list: []
