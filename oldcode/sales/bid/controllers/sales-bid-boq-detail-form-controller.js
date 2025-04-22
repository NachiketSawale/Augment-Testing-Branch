/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var modulename = 'sales.bid';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modulename).controller('salesBidBoqDetailFormController',
		['boqMainDetailFormControllerService', '$scope', '$timeout', '_', 'platformDetailControllerService', 'salesBidBoqStructureService', 'boqMainValidationServiceProvider', 'salesCommonBoqMainUIStandardService', 'boqMainTranslationService', 'boqMainDetailFormConfigService', 'boqMainCommonService', 'platformModalService', 'modelViewerStandardFilterService',
			function (boqMainDetailFormControllerService, $scope, $timeout, _, platformDetailControllerService, salesBidBoqStructureService, boqMainValidationServiceProvider, salesCommonBoqMainUIStandardService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService, modelViewerStandardFilterService) {
				boqMainDetailFormControllerService.initDetailFormController($scope, $timeout, platformDetailControllerService, salesBidBoqStructureService, boqMainValidationServiceProvider, salesCommonBoqMainUIStandardService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesBidBoqService');
			}
		]);
})();
