
(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.productionplace';

	angular.module(moduleName).controller('ppsMaintenanceDetailController', DetailController);

	DetailController.$inject = ['$scope',
		'platformGridControllerService',
		'platformContainerControllerService',
		'ppsMaintenanceDataService',
		'ppsMaintenanceUIStandardService',
		'ppsMaintenanceValidationService'];

	function DetailController($scope,
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

			platformGridControllerService.initDetailController($scope, uiService, ppsMaintenanceDataService, validationService, gridConfig);
		} else {
			platformContainerControllerService.initController($scope, 'productionplanningProductionPlace', containerUUID);
		}
	}

})(angular);