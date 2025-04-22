/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.bid';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesBidBoqStructureController',
		['boqMainNodeControllerService', '$scope', '_', 'salesBidBoqStructureService', 'platformNavBarService', 'platformGridControllerService', 'cloudDesktopHotKeyService', 'boqMainValidationServiceProvider', '$filter', 'boqMainClipboardService', 'boqMainCommonService', 'salesCommonBoqMainUIStandardService', 'boqMainTranslationService', 'platformModalService', '$translate', 'platformGridAPI', 'modelViewerStandardFilterService',
			function salesBoqMainNodeControllerFunction(boqMainNodeControllerService, $scope, _, salesBidBoqStructureService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, salesCommonBoqMainUIStandardService, boqMainTranslationService, platformModalService, $translate, platformGridAPI, modelViewerStandardFilterService) {
				salesCommonBoqMainUIStandardService.setBaseBoqMainConfigurationsService(null); // Reset to null to avoid having columns coming from other sales boq structure configurations services as in wip and billing.
				boqMainNodeControllerService.initBoqNodeController($scope, salesBidBoqStructureService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, salesCommonBoqMainUIStandardService, boqMainTranslationService, platformModalService, $translate, platformGridAPI);

				var dynamicUserDefinedColumnsService = salesBidBoqStructureService.getDynamicUserDefinedColumnsService();
				if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.applyToScope)) {
					dynamicUserDefinedColumnsService.applyToScope($scope);
				}
				if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.loadDynamicColumns)) {
					dynamicUserDefinedColumnsService.loadDynamicColumns();
				}

				modelViewerStandardFilterService.attachMainEntityFilter($scope, salesBidBoqStructureService);
			}
		]);
})();
