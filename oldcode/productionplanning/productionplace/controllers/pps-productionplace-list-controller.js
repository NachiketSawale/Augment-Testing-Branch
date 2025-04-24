(function () {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).controller('ppsProductionPlaceListController', [
		'$scope',
		'$injector',
		'platformContainerControllerService',
		'platformGridControllerService',
		function ($scope,
			$injector,
			platformContainerControllerService,
			platformGridControllerService) {
			const containerUUID = $scope.getContainerUUID();
			const serviceOptions = $scope.getContentValue('serviceOptions');

			if (!_.isNil(serviceOptions)) {
				const dataServiceFactory = $injector.get('ppsProductionPlaceDataServiceFactory');
				const validationServiceFactory = $injector.get('ppsProductionPlaceValidationServiceFactory');

				const dataService = dataServiceFactory.getService(serviceOptions);
				const uiService = $injector.get('ppsProductionPlaceUIService');
				const validationService = validationServiceFactory.getValidationService(dataService);
				const gridConfig = { initCalled: false, columns: [] };
				platformGridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			} else {
				platformContainerControllerService.initController($scope, 'productionplanningProductionPlace', containerUUID);
			}
		}
	]);
})();