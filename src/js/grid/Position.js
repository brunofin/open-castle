function Position(_x, _y, _z) {
  // X and Y values are in BLOCK_SIZE units. See Game.js
  var x = (_x !== undefined ? _x : 0),
      y = (_y !== undefined ? _y : 0),
      index = (_z !== undefined ? _z : 0); // index is represented as the CSS property z-index.

    this.x = function(value) {
      if (value === undefined) {
        return x;
      } else {
        x = value;
      }
    },
    this.y = function(value) {
      if (value === undefined) {
        return y;
      } else {
        y = value;
      }
    },
    this.z = function(value) {
      if (value === undefined) {
        return index;
      } else {
        index = value;
      }
    }
}
