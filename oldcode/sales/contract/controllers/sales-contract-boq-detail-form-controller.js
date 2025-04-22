/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var modulename = 'sales.contract';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modulename).controller('salesContractBoqDetailFormController', ['boqMainDetailFormControllerService', '$scope', '$timeout', '_', 'platformDetailControllerService', 'salesContractBoqStructureService', 'salesContractBoqStructureConfigurationService', 'boqMainValidationServiceProvider', 'salesCommonBoqMainUIStandardService', 'boqMainTranslationService', 'boqMainDetailFormConfigService', 'boqMainCommonService', 'platformModalService', 'modelViewerStandardFilterService',
		function (boqMainDetailFormControllerService, $scope, $timeout, _, platformDetailControllerService, salesContractBoqStructureService, salesContractBoqStructureConfigurationService, boqMainValidationServiceProvider, salesCommonBoqMainUIStandardService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService, modelViewerStandardFilterService) {
			var boqStructureConfigService = salesContractBoqStructureConfigurationService.createService(salesContractBoqStructureService);
			salesCommonBoqMainUIStandardService.setBaseBoqMainConfigurationsService(boqStructureConfigService);
			boqMainDetailFormControllerService.initDetailFormController($scope, $timeout, platformDetailControllerService, salesContractBoqStructureService, boqMainValidationServiceProvider, salesCommonBoqMainUIStandardService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService);

			modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesContractBoqService');
		}
	]);
})();
