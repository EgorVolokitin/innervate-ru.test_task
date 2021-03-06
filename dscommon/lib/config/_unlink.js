var lightClone, unlink, unlinkFields, unlinkTags;

lightClone = require('../utils').lightClone;

unlinkTags = function(collection) {
  var k, ref1, res, v;
  res = {};
  ref1 = collection.$$tags;
  for (k in ref1) {
    v = ref1[k];
    res[k] = v._mask;
  }
  return res;
};

unlinkFields = function(docOrField) {
  var field, i, len, ref, ref1, res, results;
  ref1 = docOrField.fields.$$list;
  results = [];
  for (i = 0, len = ref1.length; i < len; i++) {
    field = ref1[i];
    res = lightClone(field);
    if (field.hasOwnProperty('udType')) {
      res.udType = field.udType[0];
    }
    if (field.hasOwnProperty('refers')) {
      res.refers = (function() {
        var j, len1, ref2, results1;
        ref2 = field.refers;
        results1 = [];
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          ref = ref2[j];
          results1.push(ref.name);
        }
        return results1;
      })();
    }
    if (field.hasOwnProperty('fields')) {
      res.fields = unlinkFields(field);
    }
    if (field.hasOwnProperty('$$mask')) {
      res.$$mask = field.$$mask._mask;
    }
    results.push(res);
  }
  return results;
};

unlink = function(config) {
  var action, doc, res, state, transition;
  return {
    udtypes: config.udtypes.$$list,
    docs: (function() {
      var i, len, ref1, results;
      ref1 = config.docs.$$list;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        doc = ref1[i];
        results.push({
          name: doc.name,
          fields: {
            list: unlinkFields(doc),
            tags: unlinkTags(doc.fields)
          },
          actions: {
            list: (function() {
              var j, len1, ref2, results1;
              ref2 = doc.actions.$$list;
              results1 = [];
              for (j = 0, len1 = ref2.length; j < len1; j++) {
                action = ref2[j];
                results1.push(lightClone(action));
              }
              return results1;
            })(),
            tags: unlinkTags(doc.actions)
          },
          states: (function() {
            var j, len1, ref2, results1;
            ref2 = doc.states.$$list;
            results1 = [];
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              state = ref2[j];
              results1.push({
                name: state.name,
                view: state.view._mask,
                update: state.update._mask,
                transitions: (function() {
                  var l, len2, ref3, results2;
                  ref3 = state.transitions.$$list;
                  results2 = [];
                  for (l = 0, len2 = ref3.length; l < len2; l++) {
                    transition = ref3[l];
                    res = lightClone(transition);
                    res.next = res.next.name;
                    results2.push(res);
                  }
                  return results2;
                })()
              });
            }
            return results1;
          })()
        });
      }
      return results;
    })()
  };
};

module.exports = unlink;
