(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurementQuoteHeaderFormController
	 * @requires $scope, platformDetailControllerService, procurementQuoteHeaderDataService,procurementQuoteHeaderFormConfigurations,platformTranslateService,procurementQuoteHeaderValidationService
	 * @description Controller for the quote header form.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementQuoteHeaderFormController',
		['$scope', '$translate', 'platformDetailControllerService', 'procurementQuoteHeaderDataService', 'procurementQuoteHeaderUIConfigurationService',
			'platformTranslateService', 'procurementQuoteHeaderValidationService',
			'modelViewerStandardFilterService', '$injector',
			'basicsCharacteristicDataServiceFactory', 'platformFormConfigService', 'procurementQuoteBillingSchemaDataService', '$timeout','procurementCommonCreateButtonBySystemOptionService',
			function ($scope, $translate, myInitService, dataService, configurationsService, translateService, validationService, modelViewerStandardFilterService, $injector,
				basicsCharacteristicDataServiceFactory, platformFormConfigService, procurementQuoteBillingSchemaDataService, $timeout,procurementCommonCreateButtonBySystemOptionService) {

				var containerInfoService = $injector.get('procurementQuoteContainerInformationService');
				var gridContainerGuid = '338048ac80f748b3817ed1faea7c8aa5';
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 50, gridContainerGuid.toUpperCase(), containerInfoService);

				var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(dataService, 50);

				myInitService.initDetailController($scope, dataService, validationService(dataService), configurationsService, translateService);

				// dev-10043: fix general performance issue, should be after initDetailController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToForm($scope, characterColumnService, characteristicDataService);

				procurementQuoteBillingSchemaDataService.registerBillingSchemaChangeEvent();
				procurementQuoteBillingSchemaDataService.registerParentEntityCreateEvent();

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'procurementQuoteHeaderDataService');
				procurementCommonCreateButtonBySystemOptionService.removeDetailCreateButton($scope,['create']);
			}
		]);
})(angular);