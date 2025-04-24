/**
 * @ngdoc controller
 * @name boqMainController
 * @description modules main controller
 */

(function () {

	/* global globals */
	'use strict';

	var moduleName = 'boq.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('boqMainController',
		['$scope', 'platformMainControllerService', 'boqMainService', 'boqMainTranslationService', 'cloudDesktopSidebarService',
			'boqMainExportOptionsService',
			'boqMainImportOptionsService', 'estimateProjectRateBookConfigDataService', 'boqMainLookupFilterService',
			function ($scope, platformMainControllerService, boqMainService, boqMainTranslationService, cloudDesktopSidebarService,
				exportOptionsService,
				importOptionsService, estimateProjectRateBookConfigDataService, boqMainLookupFilterService) {

				var opt = {search: false, auditTrail: '723df091213840118c88ad6239939613'},
					mc = {},
					sidebarReports = platformMainControllerService.registerCompletely($scope, boqMainService, mc, boqMainTranslationService, moduleName, opt);

				// add export capability
				platformMainControllerService.registerExport(exportOptionsService.getExportOptions(boqMainService));
				// add import capability
				platformMainControllerService.registerImport(importOptionsService.getImportOptions(boqMainService));

				// rei@25.8.2015
				// own implemtation of filter because of not want to display search command button.
				cloudDesktopSidebarService.onExecuteSearchFilter.register(boqMainService.executeSearchFilter);
				cloudDesktopSidebarService.showHideButtons([{sidebarId: cloudDesktopSidebarService.getSidebarIds().search, active: false}]);
				cloudDesktopSidebarService.checkStartupFilter();

				// sidebar
				var wizards = {
					name: cloudDesktopSidebarService.getSidebarIds().newWizards,
					title: 'Wizards',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-sidebar-wizards.html'
				};
				cloudDesktopSidebarService.registerSidebarContainer(wizards, true);

				boqMainLookupFilterService.setTargetBoqMainService(boqMainService);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(boqMainService, sidebarReports, boqMainTranslationService, opt);
					cloudDesktopSidebarService.unRegisterSidebarContainer(wizards.name, true);

					// don't forget to unregister event
					cloudDesktopSidebarService.onExecuteSearchFilter.unregister(boqMainService.executeSearchFilter);
					estimateProjectRateBookConfigDataService.clearData();
					boqMainLookupFilterService.setTargetBoqMainService(null);
				});

			}]);
})();
