function Block(dimensions, position) {

  this._dimensions = (dimensions !== undefined ? dimensions : new Dimensions(1, 1));
  this._position = (position !== undefined ? position : new Position());

    this.dimensions = function(value) {
      if (value === undefined) {
        return this._dimensions;
      } else if(value instanceof Dimensions){
        this._dimensions = value;
      } else {
        throw new Error('Value must be instance of Dimensions.')
      }
    };

    this.position = function(value) {
      if (value === undefined) {
        return this._position;
      } else if(value instanceof Position){
        this._position = value;
      } else {
        throw new Error('Value must be instance of Position.')
      }
    };

};

Block.SIZE = 10;
