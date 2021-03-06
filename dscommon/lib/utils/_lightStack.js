var cwd, err, lightStack, node_modules, path;

path = require('path');

cwd = process.cwd();

err = path.join(cwd, 'utils/_err');

node_modules = path.join(cwd, 'node_modules');

lightStack = function(stack) {
  var end, i, j, p, r, rows;
  rows = stack.split('\n');
  for (i = j = rows.length - 1; j >= 0; i = j += -1) {
    r = rows[i];
    if ((p = r.indexOf(cwd)) >= 0 && !(r.indexOf(err) >= 0 || r.indexOf(node_modules) >= 0)) {
      end = r.substr(p + cwd.length);
      rows[i] = r.substr(0, p) + end;
    } else {
      rows.splice(i, 1);
    }
  }
  return rows.join('\n');
};

module.exports = lightStack;
