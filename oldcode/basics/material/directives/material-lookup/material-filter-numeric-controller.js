(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterNumericController', [
		'$scope', 'definition', 'basicsMaterialFilterOperator', 'basicsMaterialFilterOperateService',
		function ($scope, definition, basicsMaterialFilterOperator, basicsMaterialFilterOperateService) {
			basicsMaterialFilterOperateService.init($scope, definition);

			$scope.rangeError = null;

			$scope.setRangeError = function (error) {
				$scope.rangeError = error;
			};

			$scope.canApply = function () {
				if ($scope.rangeError) {
					return false;
				}

				if ($scope.definition.Operator === basicsMaterialFilterOperator.range) {
					return $scope.definition.Factors[0] != null && $scope.definition.Factors[1] != null;
				}

				return $scope.definition.Factors[0] != null;
			};
		}
	]);

})(angular);