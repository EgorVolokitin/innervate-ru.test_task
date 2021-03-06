if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
    var lastIndex, subjectString;
    subjectString = this.toString();
    if (position === void 0 || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var O, k, len, n;
    k = void 0;
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    O = Object(this);
    len = O.length >>> 0;
    if (len == 0) {
      return -1;
    }
    n = +fromIndex || 0;
    if (Math.abs(n) == Infinity) {
      n = 0;
    }
    if (n >= len) {
      return -1;
    }
    k = Math.max((n >= 0 ? n : len - Math.abs(n)), 0);
    while (k < len) {
      if (k in O && O[k] == searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

if (!Array.prototype.lastIndexOf) {
  Array.prototype.lastIndexOf = function(searchElement) {
    var k, len, n, t;
    if (this == void 0 || this == null) {
      throw new TypeError;
    }
    n = void 0;
    k = void 0;
    t = Object(this);
    len = t.length >>> 0;
    if (len == 0) {
      return -1;
    }
    n = len - 1;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) {
        n = 0;
      } else if (n != 0 && n != 1 / 0 && n != -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);
    while (k >= 0) {
      if (k in t && t[k] == searchElement) {
        return k;
      }
      k--;
    }
    return -1;
  };
}
