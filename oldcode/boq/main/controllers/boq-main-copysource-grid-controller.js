/**
 * Created in workshop GZ
 */
(function () {

	/* global */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name boqMainLookupController
	 * @function
	 *
	 * @description
	 * Controller for the tree boq lookup view.
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('boqMainLookupController',
		['boqMainNodeControllerService', '$scope', 'boqMainBoqLookupService', 'platformNavBarService', 'platformGridControllerService', 'cloudDesktopHotKeyService', '$filter', 'boqMainClipboardService', 'boqMainCommonService', 'boqMainStandardConfigurationServiceFactory', 'boqMainTranslationService', 'platformModalService', '$translate', 'platformGridAPI',
			function (boqMainNodeControllerService, $scope, boqMainBoqLookupService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, $filter, boqMainClipboardService, boqMainCommonService, boqMainStandardConfigurationServiceFactory, boqMainTranslationService, platformModalService, $translate, platformGridAPI) {

				// ///////////////////////////////////
				// Controller for boq copy grid
				// ///////////////////////////////////

				$scope.boqNodeControllerOptions = {
					readOnly: true,
					showBoqCopyButton: true
				};

				// An own instance of the boqMainStandardConfigurationService is needed here to be able to handle the assigned boqMainLookupService (assignment done in initBoqNodeController)
				// separately so there is no affect between the boq structure and the boq copy container.
				var boqMainStandardConfigurationService = boqMainStandardConfigurationServiceFactory.createBoqMainStandardConfigurationService({currentBoqMainService: boqMainBoqLookupService});

				boqMainNodeControllerService.initBoqNodeController($scope, boqMainBoqLookupService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, null, $filter, boqMainClipboardService, boqMainCommonService, boqMainStandardConfigurationService, boqMainTranslationService, platformModalService, $translate, platformGridAPI);
			}
		]);
})();
