/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var modulename = 'sales.billing';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modulename).controller('salesBillingBoqDetailFormController',
		['boqMainDetailFormControllerService', '$scope', '$timeout', '_', 'platformDetailControllerService', 'salesBillingBoqStructureService', 'boqMainValidationServiceProvider', 'salesCommonBoqMainUIStandardService', 'boqMainTranslationService', 'boqMainDetailFormConfigService', 'boqMainCommonService', 'platformModalService', 'salesBillingBoqStructureConfigurationService', 'modelViewerStandardFilterService',
			function (boqMainDetailFormControllerService, $scope, $timeout, _, platformDetailControllerService, salesBillingBoqStructureService, boqMainValidationServiceProvider, salesCommonBoqMainUIStandardService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService, salesBillingBoqStructureConfigurationService, modelViewerStandardFilterService) {
				var boqStructureConfigService = salesBillingBoqStructureConfigurationService.createService(salesBillingBoqStructureService);
				salesCommonBoqMainUIStandardService.setBaseBoqMainConfigurationsService(boqStructureConfigService);
				boqMainDetailFormControllerService.initDetailFormController($scope, $timeout, platformDetailControllerService, salesBillingBoqStructureService, boqMainValidationServiceProvider, salesCommonBoqMainUIStandardService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesBillingBoqService');
			}
		]);
})();
