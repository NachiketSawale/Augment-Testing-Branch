(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterBooleanController', [
		'$scope', 'definition', 'basicsMaterialFilterOperator',
		function ($scope, definition, basicsMaterialFilterOperator) {
			$scope.filterOperator = basicsMaterialFilterOperator;

			$scope.definition = angular.copy(definition);

			$scope.definition.Operator = basicsMaterialFilterOperator.equals;

			$scope.apply = function () {
				if (_.isString($scope.definition.Factors[0])) {
					$scope.definition.Factors[0] = Number($scope.definition.Factors[0]);
				}

				$scope.$close({
					isOk: true,
					definition: $scope.definition
				});
			};
		}
	]);

})(angular);