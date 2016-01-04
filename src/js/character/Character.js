function Character() {

  var position = new Position();
  var baseStats = new Stats();
  var dimensions = new dimensions(1, 1);

  this.position = function(value) {
      if (value === undefined) {
        return position;
      } else if(value instanceof Position){
        position = value;
      } else {
        throw new Error('Value must be instance of Position.')
      }
  };

  this.baseStats = function(value) {
      if (value === undefined) {
        return baseStats;
      } else if(value instanceof Stats){
        baseStats = value;
      } else {
        throw new Error('Value must be instance of Stats.')
      }
    };

  this.dimensions = function(value) {
      if (value === undefined) {
        return dimensions;
      } else if(value instanceof Dimensions){
        dimensions = value;
      } else {
        throw new Error('Value must be instance of Dimensions.')
      }
    };
}
