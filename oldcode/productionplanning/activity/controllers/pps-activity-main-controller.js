/**
 * Created by anl on 2/2/2018.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityController', ActivityController);

	ActivityController.$inject = ['$scope', 'platformMainControllerService',
		'productionplanningActivityTranslationService',
		'productionplanningActivityWizardService',
		'cloudDesktopSidebarService',
		'productionplanningReportReportContainerService',
		'productionplanningActivityActivityDataService',
		'productionplanningActivityContainerInformationService',
		'productionplanningActivityTrsRequisitionDataService',
		'productionplanningActivityReservedForActivityContainerService',
		'transportPlanningResourceReservationContainerService',
		'modelViewerStandardFilterService',
		'ppsDocumentReportService'];

	function ActivityController($scope, platformMainControllerService,
								translationService,
								wizardService,
								cloudDesktopSidebarService,
								reportContainerService,
								activityDataService,
								activityContainerInformationService,
								trsRequisitionDataService,
								actReservationContainerService,
								trsReservationContainerService,
								modelViewerStandardFilterService,
								ppsDocumentReportService) {

		var options = {search: true, reports: false, auditTrail: 'e1cffe2b2d8542138900940b4bd0813c'};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, activityDataService,
			{}, translationService, moduleName, options);

		wizardService.activate();

		//sidebar | information
		var info = {
			name: cloudDesktopSidebarService.getSidebarIds().info,
			title: 'info',
			type: 'template',
			templateUrl: globals.appBaseUrl + 'productionplanning.activity/templates/sidebar-info.html'
		};

		cloudDesktopSidebarService.registerSidebarContainer(info, true);


		//Init DynamicReportDataService
		var reportGUID = '1435d4d81ed6429bb7cdcfb80ff39f2b';
		var reportOriginLayout = 'a17a58e59a944f95ae9e0c7f627c9e1a';
		var reportInitConfig = {
			id: reportGUID,
			layout: reportGUID,
			usedLayout: reportOriginLayout,
			moduleName: moduleName
		};
		if (!activityContainerInformationService.hasDynamic(reportGUID)) {
			reportContainerService.prepareGridConfig(reportGUID,
				activityContainerInformationService, reportInitConfig, activityDataService);
		}

		//Init DynamicReservations
		var _actReservationScope = {
			id: 'ff65929c43634e1791dba161302d98c6',
			uuid: 'ff65929c43634e1791dba161302d98c6',
			layout: 'ff65929c43634e1791dba161302d98c6'
		};
		_actReservationScope.getContentValue = function (token) {
			switch (token) {
				case 'id':
					return _actReservationScope.id;
				case 'uuid':
					return _actReservationScope.uuid;
				case 'layout':
					return _actReservationScope.layout;
			}
		};
		if (!activityContainerInformationService.hasDynamic(_actReservationScope.uuid)) {
			actReservationContainerService.prepareGridConfig(_actReservationScope.uuid, _actReservationScope,
				activityContainerInformationService, 'ProductionPlanning.Activity', activityDataService);
		}

		var _trsReservationScope = {
			id: 'd227d73d05a6406bad800e8c0dee7b46',
			uuid: 'd227d73d05a6406bad800e8c0dee7b46',
			layout: 'd227d73d05a6406bad800e8c0dee7b46'
		};
		_trsReservationScope.getContentValue = function (token) {
			switch (token) {
				case 'id':
					return _trsReservationScope.id;
				case 'uuid':
					return _trsReservationScope.uuid;
				case 'layout':
					return _trsReservationScope.layout;
			}
		};
		if (!activityContainerInformationService.hasDynamic(_trsReservationScope.uuid)) {
			trsReservationContainerService.prepareGridConfig(_trsReservationScope.uuid, _trsReservationScope,
				activityContainerInformationService, 'ProductionPlanning.Activity', trsRequisitionDataService);
		}

		modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('ppsActivityModelFilterService');

		// un-register on destroy
		$scope.$on('$destroy', function () {
			ppsDocumentReportService.unregisterReportPrepare();
			wizardService.deactivate();
			cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
			platformMainControllerService.unregisterCompletely(activityDataService, sidebarReports,
				translationService, options);
		});
	}
})();