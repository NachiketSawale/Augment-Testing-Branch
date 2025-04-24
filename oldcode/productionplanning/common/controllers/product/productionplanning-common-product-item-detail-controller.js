(function () {
	/* global */
	'use strict';
	const moduleName = 'productionplanning.common';
	const angModule = angular.module(moduleName);

	angModule.controller('productionplanningCommonProductItemDetailController', ProductionplanningCommonProductItemDetailController);

	ProductionplanningCommonProductItemDetailController.$inject = ['$scope', '$injector', '$timeout',
		'platformFormConfigService',
		'platformDetailControllerService',
		'basicsCharacteristicDataServiceFactory',
		'productionplanningCommonProductItemDataService',
		'productionplanningCommonProductUIStandardService',
		'productionplanningCommonProductValidationFactory'];
	function ProductionplanningCommonProductItemDetailController($scope, $injector, $timeout,
		platformFormConfigService,
		detailControllerService,
		basicsCharacteristicDataServiceFactory,
		dataService,
		uiStandardService,
		validationServiceFactory) {

		const formContainerGuid = $scope.getContentValue('uuid');
		const characteristic2SectionId = 64;

		const validationService = validationServiceFactory.getValidationService(dataService);
		detailControllerService.initDetailController($scope, dataService, validationService, uiStandardService,'productionplanningCommonTranslationService');

		// extend characteristic2
		const characteristic2Config = {
			sectionId: characteristic2SectionId,
			scope: $scope,
			formContainerId: formContainerGuid,
			dataService: dataService,
			containerInfoService: 'productionplanningProductContainerInformationService',
		};
		const characteristic2RowEventsHelper = $injector.get('PpsCommonCharacteristic2RowEventsHelper');
		characteristic2RowEventsHelper.register(characteristic2Config);

		$scope.$on('$destroy', function () {
			characteristic2RowEventsHelper.unregister(characteristic2Config, characteristic2SectionId);
		});
	}
})();