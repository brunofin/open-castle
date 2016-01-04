function Dimensions(_width, _height) {
  // Values are represented in BLOCK_SIZE. See Game.js.

  var width = (_width !== undefined ? _width : 1),
      height = (_height !== undefined ? _height : 1);

  this.width = function(value) {
      if (value === undefined) {
        return width;
      } else {
        width = value;
      }
    },

  this.height = function(value) {
      if (value === undefined) {
        return height;
      } else {
        height = value;
      }
    }
}
