(function (angular) {
	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).controller('salesContractTransactionGridController', [
		'$scope',
		'platformGridControllerService',
		'salesContractTransactionDataService',
		'salesOrdTransactionUIStandardService',
		function (
			$scope,
			gridControllerService,
			dataService,
			gridColumns
		) {
			var gridConfig = {
				initCalled: false,
				columns: []
			};

			gridControllerService.initListController($scope, gridColumns, dataService, null, gridConfig);

			var index = 0;
			for (; index < $scope.tools.items.length; index++) {
				if ($scope.tools.items[index].id === 't14') {
					break;
				}
			}
			$scope.tools.items.splice(index, 1);
			index = 0;
			for (; index < $scope.tools.items.length; index++) {
				if ($scope.tools.items[index].id === 'delete') {
					break;
				}
			}
			$scope.tools.items.splice(index, 1);
		}
	]);
})(angular);