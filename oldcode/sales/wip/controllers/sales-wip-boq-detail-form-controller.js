/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var modulename = 'sales.wip';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modulename).controller('salesWipBoqDetailFormController',
		['boqMainDetailFormControllerService', '$scope', '$timeout', '_', 'platformDetailControllerService', 'salesWipBoqStructureService', 'boqMainValidationServiceProvider', 'salesCommonBoqMainUIStandardService', 'boqMainTranslationService', 'boqMainDetailFormConfigService', 'boqMainCommonService', 'platformModalService', 'salesWipBoqStructureConfigurationService', 'modelViewerStandardFilterService',
			function (boqMainDetailFormControllerService, $scope, $timeout, _, platformDetailControllerService, salesWipBoqStructureService, boqMainValidationServiceProvider, salesCommonBoqMainUIStandardService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService, salesWipBoqStructureConfigurationService, modelViewerStandardFilterService) {
				var boqStructureConfigService = salesWipBoqStructureConfigurationService.createService(salesWipBoqStructureService);
				salesCommonBoqMainUIStandardService.setBaseBoqMainConfigurationsService(boqStructureConfigService);
				boqMainDetailFormControllerService.initDetailFormController($scope, $timeout, platformDetailControllerService, salesWipBoqStructureService, boqMainValidationServiceProvider, salesCommonBoqMainUIStandardService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesWipBoqService');
			}
		]);
})();
