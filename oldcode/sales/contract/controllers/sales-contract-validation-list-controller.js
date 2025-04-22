(function (angular) {
	'use strict';

	var moduleName = 'sales.contract';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesContractValidationListController',
		['$scope', 'platformGridControllerService', 'salesContractValidationDataService', 'salesContractValidationUIStandardService',
			function ($scope, gridControllerService, dataService, gridColumns) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, {}, gridConfig);

				var index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 't14') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);
			}
		]);

})(angular);
