(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.engineering';
	const module = angular.module(moduleName);

	module.controller('productionplanningProducttemplateProductDescriptionDetailController', Controller);

	Controller.$inject = ['$scope', 'platformDetailControllerService',
		'$injector',
		'$timeout',
		'platformFormConfigService',
		'basicsCharacteristicDataServiceFactory',
		'productionplanningProducttemplateProductDescriptionUIStandardService',
		'productionplanningProducttemplateTranslationService'];
	function Controller($scope, platformDetailControllerService,
		$injector,
		$timeout,
		platformFormConfigService,
		basicsCharacteristicDataServiceFactory,
		uiStandardService,
		translationService) {

		const formContainerGuid = $scope.getContentValue('uuid');
		const characteristic2SectionId = 62;

		let dataService, validationService;
		const serviceOptions = $scope.getContentValue('serviceOptions');
		if (!serviceOptions) {
			dataService = $injector.get('productionplanningProducttemplateMainService');
			validationService = $injector.get('productionplanningProducttemplateProductDescriptionValidationService');
		} else {
			dataService = $injector.get('productionplanningProducttemplateProductDescriptionDataServiceFactory').getService(serviceOptions);
			validationService = $injector.get('productionplanningProducttemplateProductDescriptionValidationServiceFactory').getService(dataService);
		}

		platformDetailControllerService.initDetailController($scope, dataService, validationService, uiStandardService, translationService);

		// extend characteristic2
		const characteristic2Config = {
			sectionId: characteristic2SectionId,
			scope: $scope,
			formContainerId: formContainerGuid,
			dataService: dataService,
			containerInfoService: 'productionplanningProductTemplateContainerInformationService',
		};
		const characteristic2RowEventsHelper = $injector.get('PpsCommonCharacteristic2RowEventsHelper');
		characteristic2RowEventsHelper.register(characteristic2Config);

		$scope.$on('$destroy', function () {
			characteristic2RowEventsHelper.unregister(characteristic2Config, characteristic2SectionId);
		});
	}

})(angular);