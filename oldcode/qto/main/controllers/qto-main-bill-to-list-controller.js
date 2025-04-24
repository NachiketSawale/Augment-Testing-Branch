(function () {
	'use strict';

	let moduleName = 'qto.main';

	angular.module(moduleName).controller('qtoMainBillToListController',
		['$scope', '$injector', 'platformGridControllerService', 'qtoMainBillToDataService', 'qtoMainBillToUIStandardService', 'platformGridAPI', 'qtoMainClipboardService','$timeout','platformPermissionService',
			function ($scope, $injector, gridControllerService, dataService, uiStandardService, platformGridAPI, qtoMainClipboardService,$timeout,platformPermissionService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
					type: 'BillTos',
					dragDropService: qtoMainClipboardService
				};

				myGridConfig = angular.extend(dataService.getGridConfig(), myGridConfig);
				gridControllerService.initListController($scope, uiStandardService, dataService, null, myGridConfig);

				platformPermissionService.restrict('316d0dd8ca0446248198d2265f363704', 1);
				$scope.$on('$destroy', function () {
				});
			}
		]);
})();