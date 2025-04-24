(function (angular) {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).constant('basicsMaterialFilterOperator', {
		equals: 1,
		lessThan: 2,
		greaterThan: 3,
		range: 4,
		contains: 5,
		startsWith: 6,
		endsWith: 7
	});

	angular.module(moduleName).service('basicsMaterialFilterOperateService', [
		'basicsMaterialFilterOperator',
		function (basicsMaterialFilterOperator) {
			this.init = function init(scope, definition) {
				const operatorToFilter = {};
				scope.filterOperator = basicsMaterialFilterOperator;

				scope.definition = angular.copy(definition);
				if (scope.definition.Operator) {
					operatorToFilter[scope.definition.Operator] = scope.definition.Factors;
				}

				scope.apply = function () {
					scope.$close({
						isOk: true,
						definition: scope.definition
					});
				};

				scope.changeOperator = function () {
					scope.definition.Operator = Number(scope.definition.Operator);
					scope.definition.Factors = operatorToFilter[scope.definition.Operator] ?? [];
					operatorToFilter[scope.definition.Operator] = scope.definition.Factors;
				};
			}
		}]);

})(angular);