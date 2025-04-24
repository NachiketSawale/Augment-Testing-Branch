/* global globals */

(function () {
	'use strict';
	var moduleName = 'scheduling.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainController',
		[
			'$scope',
			'platformMainControllerService',
			'schedulingMainService',
			'platformTranslateService',
			'schedulingMainTranslationService',
			'schedulingMainSidebarWizardService',
			'cloudDesktopSidebarService',
			'schedulingMainRelationshipService',
			'schedulingMainDocumentsProjectService',
			'schedulingMainBaselineService',
			'schedulingMainActivity2ModelObjectService',
			'modelViewerStandardFilterService',
			'schedulingMainObjectSelectorService',
			'schedulingMainBaselineRelationshipService',

			function ($scope,
				platformMainControllerService,
				schedulingMainService,
				platformTranslateService,
				schedulingMainTranslationService,
				schedulingMainSidebarWizardService,
				cloudDesktopSidebarService,
				schedulingMainRelationshipService,
				schedulingMainDocumentsProjectService,
				schedulingMainBaselineService,
				schedulingMainActivity2ModelObjectService,
				modelViewerStandardFilterService,
				schedulingMainObjectSelectorService,
				schedulingMainBaselineRelationshipService) {

				$scope.path = globals.appBaseUrl;
				var opt = {search: true, reports: false, auditTrail: '716ad9be91144b398d0f1e3ab45f465a'};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, schedulingMainService, mc, schedulingMainTranslationService, moduleName, opt);

				schedulingMainSidebarWizardService.activate();

				// sidebar | information
				var info = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'scheduling.main/templates/sidebar/sidebar-info.html'
				};

				cloudDesktopSidebarService.registerSidebarContainer(info, true);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('schedulingMainModelFilterService');

				schedulingMainRelationshipService.initService();
				schedulingMainBaselineRelationshipService.initService();

				schedulingMainDocumentsProjectService.register();
				schedulingMainBaselineService.register();
				schedulingMainActivity2ModelObjectService.activateViewerControlling();
				schedulingMainObjectSelectorService.initialize();

				// un-register on destroy
				$scope.$on('$destroy', function () {
					schedulingMainActivity2ModelObjectService.deActivateViewerControlling();
					schedulingMainSidebarWizardService.deactivate();
					platformMainControllerService.unregisterCompletely(schedulingMainService, sidebarReports, schedulingMainTranslationService, opt);
					cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
					schedulingMainDocumentsProjectService.unRegister();
					schedulingMainBaselineService.unRegister();
				});
			}
		]);
})();
