(function () {

	'use strict';
	var moduleName = 'basics.dependentdata';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 * Controller for the list view of module entities.
	 **/
	angModule.controller('basicsDependentDataListController',
		['$scope', 'basicsDependentDataMainService', 'basicsDependentDataUIStandardService', 'platformGridControllerService', '$translate', 'cloudDesktopSidebarService',
			'basicsDependentDataValidationService',
			function ($scope, basicsDependentDataMainService, basicsDependentDataUIStandardService, platformGridControllerService, $translate, cloudDesktopSidebarService,
			          validationService) {

				var myGridConfig = { initCalled: false, columns: [] };

				platformGridControllerService.initListController($scope, basicsDependentDataUIStandardService, basicsDependentDataMainService, validationService, myGridConfig);

				// region Sidebar stuff

				cloudDesktopSidebarService.showHideButtons([{
					sidebarId: cloudDesktopSidebarService.getSidebarIds().search,
					active: true
				}]);

				// register my search handler
				cloudDesktopSidebarService.onExecuteSearchFilter.register(basicsDependentDataMainService.executeSearchFilter);
				// initialize the search parameter for my module register my search handler
				basicsDependentDataMainService.registerSidebarFilter();

				// endregion

				// unregister messenger
				$scope.$on('$destroy', function () {
					cloudDesktopSidebarService.onExecuteSearchFilter.unregister(basicsDependentDataMainService.executeSearchFilter);
				});

				var init = function() {
					// executes sidebarFilter with Startup parameter if there is one, otherwise returning false
					if (cloudDesktopSidebarService.checkStartupFilter()) {
						cloudDesktopSidebarService.filterStartSearch();
					}

				};
				init();


			}
		]);
})();