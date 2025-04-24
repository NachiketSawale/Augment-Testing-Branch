/**
 * Created by wuj on 9/9/2014.
 */

(function (angular) {
	'use strict';
	/* jshint -W072*/ //many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name basics.Material.basicsMaterialRecordGridController
	 * @require $scope
	 * @description controller for basics material record
	 */
	angular.module('basics.material').controller('basicsMaterialRecordGridController',
		['$injector', '$scope', 'platformGridControllerService', 'basicsMaterialRecordService',
			'basicsMaterialRecordUIConfigurationService', 'basicsMaterialRecordValidationService',
			'basicsMaterialClipboardService',
			function ($injector,$scope, gridControllerService, dataService, uiConfigurationService, validationService, basicsMaterialClipboardService) {
				var gridConfig = {
					columns: [],
					type: 'basics.material',
					dragDropService: basicsMaterialClipboardService
				};
				gridControllerService.initListController($scope, uiConfigurationService, dataService, validationService, gridConfig);

				dataService.registerListLoaded(handleListLoaded);
				function handleListLoaded()
				{
					if(dataService.hasSelection())
					{
						$scope.selectedEntityID=-1;
					}
				}

				$scope.$on('$destroy', function () {
					dataService.unregisterListLoaded(handleListLoaded);
				});
				var inquiryService = $injector.get('cloudDesktopSidebarInquiryService');
				inquiryService.handleInquiryToolbarButtons($scope, true/* include all button, depending on selection*/);
			}]);
})(angular);