
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'hsqe.checklist';

	angular.module(moduleName).controller('hsqeChecklistController',
		['$scope', '$injector', 'platformMainControllerService', 'hsqeCheckListDataService', 'hsqeCheckListUIStandardService',
			'hsqeCheckListTranslationService', 'modelViewerStandardFilterService',
			function hsqeChecklistController($scope, $injector, mainControllerService, dataService, gridColumns,
				translationService, modelViewerStandardFilterService) {
				$scope.path = globals.appBaseUrl;
				var opt = {
					search: true,
					reports: false,
					auditTrail: '1f8a0d82abd74fc3b0803a51504a36c5'
				};
				var sidebarReports = mainControllerService.registerCompletely($scope, dataService, {}, translationService, moduleName, opt);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('hsqeCheckListModelFilterService');
				function onCheckListSelectionChanged() {
					modelViewerStandardFilterService.updateMainEntityFilter();
				}
				dataService.registerSelectedEntitiesChanged(onCheckListSelectionChanged);
				var moduleContext = $injector.get('procurementContextService');
				// set module context variables
				moduleContext.setLeadingService(dataService);
				moduleContext.setMainService(dataService);

				$scope.$on('$destroy', function destroy() {
					mainControllerService.unregisterCompletely(dataService, sidebarReports, translationService, opt);
					dataService.unregisterSelectedEntitiesChanged(onCheckListSelectionChanged);

					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
				});
			}
		]);
})();
