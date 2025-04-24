/**
 * Created by waz on 1/10/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingUnassignedBundleListController', ProductionplanningMountingUnassignedBundleListController);
	ProductionplanningMountingUnassignedBundleListController.$inject = ['$scope',
		'transportplanningBundleUnassignedListControllerService',
		'transportplanningBundleUIReadonlyService',
		'transportplanningBundleValidationService',
		'productionplanningMountingUnassignedBundleDataService',
		'productionplanningMountingBundleClipBoardService'];

	function ProductionplanningMountingUnassignedBundleListController($scope,
	                                                                  gridControllerService,
	                                                                  uiService,
	                                                                  validationService,
	                                                                  dataService,
	                                                                  clipBoardService) {
		var gridConfig = {initCalled: false, columns: [], dragDropService: clipBoardService, type: 'unassignedBundle'};
		gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
	}
})(angular);