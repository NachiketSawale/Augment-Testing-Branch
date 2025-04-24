
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.productionplace';

	angular.module(moduleName).controller('ppsMaintenanceListController', ListController);

	ListController.$inject = ['$scope',
		'platformGridControllerService',
		'platformContainerControllerService',
		'ppsMaintenanceDataService',
		'ppsMaintenanceUIStandardService',
		'ppsMaintenanceValidationService'];

	function ListController($scope,
		platformGridControllerService,
		platformContainerControllerService,
		ppsMaintenanceDataService,
		uiStandardService,
		ppsMaintenanceValidationService) {

		const containerUUID = $scope.getContainerUUID();
		const serviceOptions = $scope.getContentValue('serviceOptions');

		if (!_.isNil(serviceOptions)) {
			const uiService = uiStandardService;
			const validationService = ppsMaintenanceValidationService;
			const gridConfig = { initCalled: false, columns: [] };

			platformGridControllerService.initListController($scope, uiService, ppsMaintenanceDataService, validationService, gridConfig);
		} else {
			platformContainerControllerService.initController($scope, 'productionplanningProductionPlace', containerUUID);
		}
	}

})(angular);