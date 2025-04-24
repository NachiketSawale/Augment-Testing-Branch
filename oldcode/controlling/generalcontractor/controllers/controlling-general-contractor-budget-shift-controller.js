(function (angular) {
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).controller('controllingGeneralContractorBudgetShiftController', ['_', '$scope', '$timeout', 'platformGridControllerService',
		'controllingGeneralContractorBudgetShiftConfigService','controllingGeneralContractorBudgetShiftDataService',
		'controllingGeneralcontractorControllerFeaturesServiceProvider',
		function (_, $scope, $timeout, platformGridControllerService,
			uiService, dataService,
			controllerFeaturesServiceProvider){

			platformGridControllerService.initListController($scope, uiService, dataService, null, {
				initCalled: false, columns: [],
				sortOptions: {
					initialSortColumn: {field: 'code', id: 'code'},
					isAsc: true
				}
			});

			controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

			dataService.refreshData();
		}
	]);
})(angular);