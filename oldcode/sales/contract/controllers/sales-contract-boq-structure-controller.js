/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var moduleName = 'sales.contract';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesContractBoqStructureController',
		['boqMainNodeControllerService', '$scope', '_', 'salesContractBoqStructureService', 'salesContractBoqStructureConfigurationService', 'platformNavBarService', 'platformGridControllerService', 'cloudDesktopHotKeyService', 'boqMainValidationServiceProvider', '$filter', 'boqMainClipboardService', 'boqMainCommonService', 'salesCommonBoqMainUIStandardService', 'boqMainTranslationService', 'platformModalService', '$translate', 'platformGridAPI', 'modelViewerStandardFilterService',
			function salesBoqMainNodeControllerFunction(boqMainNodeControllerService, $scope, _, salesContractBoqStructureService, salesContractBoqStructureConfigurationService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, salesCommonBoqMainUIStandardService, boqMainTranslationService, platformModalService, $translate, platformGridAPI, modelViewerStandardFilterService) {
				var boqStructureConfigService = salesContractBoqStructureConfigurationService.createService(salesContractBoqStructureService);
				salesCommonBoqMainUIStandardService.setBaseBoqMainConfigurationsService(boqStructureConfigService);
				boqMainNodeControllerService.initBoqNodeController($scope, salesContractBoqStructureService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, salesCommonBoqMainUIStandardService, boqMainTranslationService, platformModalService, $translate, platformGridAPI);

				var dynamicUserDefinedColumnsService = salesContractBoqStructureService.getDynamicUserDefinedColumnsService();
				if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.applyToScope)) {
					dynamicUserDefinedColumnsService.applyToScope($scope);
				}
				if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.loadDynamicColumns)) {
					dynamicUserDefinedColumnsService.loadDynamicColumns();
				}

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesContractBoqStructureService');
			}
		]);
})();
