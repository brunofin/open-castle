(function(angular) {
  var app = angular.module('OCMap', []);

  app.service('MapService', ['$http', function($http) {
    return {
      load: function(mapName) {
        return $http({
          method: 'GET',
          url: 'maps/' + mapName + '.json'
        });
      }
    }
  }]);

  /**
  Full JSON representation of a Tile block:
  Missing values should be translated into default values. x and y cannot be ommited.
  {
    "type": "WALL-BLOCK",
    "x": 0,
    "y": 4,
    "z": 0,
    "width": 1,
    "height": 1
  }
  */
  app.directive('mapRenderer', ['MapService', function(MapService) {
    return {
      scope: {
        mapName: '@'
      },
      templateUrl: 'partials/map.tmpl.html',
      link: function($scope, el) {
        MapService.load($scope.mapName).then(function(response) {
          if (response.status == 200) {
            $scope.map = response.data.map;
          }
        })
      }
    }
  }])
})(angular);
