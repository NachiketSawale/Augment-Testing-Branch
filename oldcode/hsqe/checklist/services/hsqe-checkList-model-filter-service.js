
(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListModelFilterService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	angular.module(moduleName).factory('hsqeCheckListModelFilterService', ['_', 'hsqeCheckListDataService',
		'projectMainProjectSelectionService', 'modelViewerFilterFuncFactory', 'hsqeCheckListModelAnnoObjectLinkDataService',
		function (_, dataService,
			projectMainProjectSelectionService, modelViewerFilterFuncFactory, hsqeCheckListModelAnnoObjectLinkDataService) {
			projectMainProjectSelectionService.setItemSource('pinnedProject');

			return modelViewerFilterFuncFactory.createForDataService([hsqeCheckListModelAnnoObjectLinkDataService.createModelFilterSettings(), {
				serviceName: 'hsqeCheckListDataService'
			}]);
		}]);

})(angular);
