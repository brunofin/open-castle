function Stats() {

    var health = 0,
        power = 0,
        intelligence = 0,
        strength = 0,
        agility = 0;

     this.health = function(value) {
       if (value === undefined) {
         return health;
       } else {
         health = value;
       }
     };
     this.power = function(value) {
       if (value === undefined) {
         return power;
       } else {
         power = value;
       }
     };
     this.intelligence = function(value) {
       if (value === undefined) {
         return intelligence;
       } else {
         intelligence = value;
       }
     };
     this.strength = function(value) {
       if (value === undefined) {
         return strength;
       } else {
         strength = value;
       }
     };
     this.agility = function(value) {
       if (value === undefined) {
         return agility;
       } else {
         agility = value;
       }
     };


   }
