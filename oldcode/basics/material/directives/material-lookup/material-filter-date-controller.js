(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterDateController', [
		'$scope', 'definition', 'basicsMaterialFilterOperator', 'basicsMaterialFilterOperateService',
		function ($scope, definition, basicsMaterialFilterOperator, basicsMaterialFilterOperateService) {
			basicsMaterialFilterOperateService.init($scope, definition);

			$scope.apply = function () {
				revertFactors();

				$scope.$close({
					isOk: true,
					definition: $scope.definition
				});
			};

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

			function toMoment(value) {
				if (moment.isMoment(value)) {
					return value;
				}

				return moment.utc(value);
			}

			function revertMoment(value) {
				if (moment.isMoment(value)) {
					return value.utc().format();
				}

				return value;
			}

			function processFactors() {
				if ($scope.definition.Factors) {
					$scope.definition.Factors = $scope.definition.Factors.map(toMoment);
				}
			}

			function revertFactors() {
				if ($scope.definition.Factors) {
					$scope.definition.Factors = $scope.definition.Factors.map(revertMoment);
				}
			}

			processFactors();
		}
	]);

})(angular);