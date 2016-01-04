(function(angular) {
  var app = angular.module('OpenCastle', ['ngMaterial', 'OCMap']);

  app.directive('game', function() {
    return {
      templateUrl: 'partials/open-castle.tmpl.html',
      link: function($scope) {
        console.log('I have been loaded.');
      }
    }
  });

  function createBlockDirective(BlockConstructor) {
    return {
      scope: {
        x: '@',
        y: '@',
        z: '@',
        width: '@',
        height: '@',
        type: '@',

        block: '='
      },
      link: function($scope, el) {

        if ($scope.block === undefined) {
          var dimensions = new Dimensions($scope.width, $scope.height);
          var position = new Position($scope.x, $scope.y, $scope.z);

          $scope.block = new BlockConstructor(dimensions, position);
        }

        el[0].style.width = $scope.block.dimensions().width() * Block.SIZE + 'px';
        el[0].style.height = $scope.block.dimensions().height() * Block.SIZE + 'px';

        el[0].style.left = $scope.block.position().x() * Block.SIZE + 'px';
        el[0].style.bottom = $scope.block.position().y() * Block.SIZE + 'px';
        el[0].style.zIndex = $scope.block.position().z();
      }
    }
  }

  app.directive('block', function() {
    return createBlockDirective(Block);
  });

  app.directive('floorBlock', function() {
    return createBlockDirective(FloorBlock);
  });

  app.directive('wallBlock', function() {
    return createBlockDirective(WallBlock);
  });


})(window.angular);
