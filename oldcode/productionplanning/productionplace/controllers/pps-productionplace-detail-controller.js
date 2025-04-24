(function () {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).controller('ppsProductionPlaceDetailController', [
		'$scope', '$injector', 'platformContainerControllerService', 'platformDetailControllerService',
		'productionplanningProductionPlaceTranslationService',
		function ($scope, $injector, platformContainerControllerService, platformDetailControllerService,
			translationService) {
			const containerUUID = $scope.getContainerUUID();
			const serviceOptions = $scope.getContentValue('serviceOptions');

			if (!_.isNil(serviceOptions)) {
				const dataServiceFactory = $injector.get('ppsProductionPlaceDataServiceFactory');
				const validationServiceFactory = $injector.get('ppsProductionPlaceValidationServiceFactory');

				const dataService = dataServiceFactory.getService(serviceOptions);
				const validationService = validationServiceFactory.getValidationService(dataService);

				const ppsProductionPlaceUIService = $injector.get('ppsProductionPlaceUIService');
				platformDetailControllerService.initDetailController($scope, dataService, validationService, ppsProductionPlaceUIService, translationService);

				$scope.$on('PpsProductPlaceChanged', function () {
					dataService.load();
				});
			} else {
				platformContainerControllerService.initController($scope, 'productionplanningProductionPlace', containerUUID, translationService);
			}
		}
	]);
})();