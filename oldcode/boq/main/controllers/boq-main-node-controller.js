(function () {

	/* global */
	'use strict';
	/**
	 * @ngdoc controller
	 * @name boqMainNodeController
	 * @function
	 *
	 * @description
	 * Controller for the tree grid view of boq items.
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('boq.main').controller('boqMainNodeController',
		['boqMainNodeControllerService', '$scope', 'boqMainService', 'platformNavBarService', 'platformGridControllerService', 'cloudDesktopHotKeyService', 'boqMainValidationServiceProvider', '$filter', 'boqMainClipboardService', 'boqMainCommonService', 'boqMainStandardConfigurationServiceFactory', 'boqMainTranslationService', 'platformModalService', '$translate', 'platformGridAPI',
			function boqMainNodeControllerFunction(boqMainNodeControllerService, $scope, boqMainService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, boqMainStandardConfigurationServiceFactory, boqMainTranslationService, platformModalService, $translate, platformGridAPI) {

				// Special case: This controller is for project boqs which are not base boqs so we remove the asynchronous validation of the reference
				boqMainValidationServiceProvider.skipAsyncValidateReference(true);
				var boqMainStandardConfigurationService = boqMainStandardConfigurationServiceFactory.createBoqMainStandardConfigurationService({currentBoqMainService: boqMainService});

				boqMainNodeControllerService.initBoqNodeController($scope, boqMainService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, boqMainStandardConfigurationService, boqMainTranslationService, platformModalService, $translate, platformGridAPI);

				boqMainService.registerFilters();

				$scope.$on('$destroy', function () {
					boqMainService.unregisterFilters();
				});

			}
		]);
})();
