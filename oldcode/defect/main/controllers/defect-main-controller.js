/* global , globals */
(function () {
	'use strict';
	var moduleName = 'defect.main';

	angular.module(moduleName).controller('defectMainController',
		['$scope', '$injector', 'platformMainControllerService','defectMainTranslationService','defectMainHeaderDataService','defectMainWizardService',
			'modelViewerStandardFilterService','defectNumberGenerationSettingsService',
			function ($scope, $injector, platformMainControllerService,defectMainTranslationService,defectMainHeaderDataService,defectMainWizardService,
				modelViewerStandardFilterService,defectNumberGenerationSettingsService) {
				$scope.path = globals.appBaseUrl;
				var exportOptions = {
					ModuleName: moduleName,
					permission: '01A52CC968494EACACE7669FB996BC72',
					MainContainer: {
						Id: '1',
						Label: 'project.main.projectListTitle'
					}
				};



				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('defectMainModelFilterService');

				var opt = {search: true,
					reports: true,
					wizards: true,
					auditTrail: 'a380d08a2a4843c0b3f6f62898884023'
				};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, defectMainHeaderDataService, {}, defectMainTranslationService, moduleName, opt);

				platformMainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

				defectMainWizardService.active();

				defectMainHeaderDataService.registerSelectedEntitiesChanged(onDefectSelectionChanged);

				defectNumberGenerationSettingsService.assertLoaded();

				function onDefectSelectionChanged() {
					modelViewerStandardFilterService.updateMainEntityFilter();
				}

				var moduleContext = $injector.get('procurementContextService');
				// set module context variables
				moduleContext.setLeadingService(defectMainHeaderDataService);
				moduleContext.setMainService(defectMainHeaderDataService);


				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(defectMainHeaderDataService, sidebarReports, defectMainTranslationService, opt);
					defectMainHeaderDataService.unregisterSelectedEntitiesChanged(onDefectSelectionChanged);

					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
				});
			}
		]);
})();