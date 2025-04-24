/**
 * Created by anl on 8/9/2017.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingController', MountingController);

	MountingController.$inject = ['$scope', 'platformMainControllerService',
		'productionplanningMountingRequisitionDataService',
		'productionplanningMountingTranslationService',
		'productionplanningMountingWizardService',
		'cloudDesktopSidebarService',
		'productionplanningMountingContainerInformationService',
		'productionplanningReportReportContainerService',
		'productionplanningActivityActivityContainerService',
		'productionplanningActivityReservedForActivityContainerService',
		'transportPlanningResourceReservationContainerService',
		'$injector',
		'modelViewerStandardFilterService',
		'ppsDocumentReportService'];

	function MountingController($scope, platformMainControllerService,
								requisitionDataService,
								translationService,
								wizardService,
								cloudDesktopSidebarService,
								mountingContainerInformationService,
								reportContainerService,
								activityContainerService,
								actReservationContainerService,
								trsReservationContainerService,
								$injector,
								modelViewerStandardFilterService,
								ppsDocumentReportService) {

		var options = {search: true, reports: false, auditTrail: '30be7c98d3324382855fc795beecb3cb'};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, requisitionDataService,
			{}, translationService, moduleName, options);

		requisitionDataService.ensureInitContext();
		wizardService.activate();

		//sidebar | information
		var info = {
			name: cloudDesktopSidebarService.getSidebarIds().info,
			title: 'info',
			type: 'template',
			templateUrl: globals.appBaseUrl + 'productionplanning.mounting/templates/sidebar-info.html'
		};

		cloudDesktopSidebarService.registerSidebarContainer(info, true);

		//Init DynamicActivityDataService
		var activityUid = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		var originLayout = '0fabc9f2d6a946b1bd5517bb7229e10a';
		var initConfig =
		{
			id: activityUid,
			layout: activityUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!mountingContainerInformationService.hasDynamic(activityUid)) {
			activityContainerService.prepareGridConfig(activityUid, mountingContainerInformationService,
				initConfig, requisitionDataService);
		}

		wizardService.AppendMethods();

		var dynamicActivityDataService = mountingContainerInformationService.getContainerInfoByGuid(activityUid).dataServiceName;
		//Init DynamicReportDataService
		var reportGUID = '518268e717e2413a8107c970919eea85';
		var reportOriginLayout = 'a17a58e59a944f95ae9e0c7f627c9e1a';
		var reportInitConfig = {
			id: reportGUID,
			layout: reportGUID,
			usedLayout: reportOriginLayout,
			moduleName: moduleName
		};

		if (!mountingContainerInformationService.hasDynamic(reportGUID)) {
			reportContainerService.prepareGridConfig(reportGUID,
				mountingContainerInformationService, reportInitConfig, dynamicActivityDataService);
		}

		//Init DynamicReservations
		var _actReservationScope = {
			id: 'a9e90275f8de429db681448f6caefce3',
			uuid: 'a9e90275f8de429db681448f6caefce3',
			layout: 'a9e90275f8de429db681448f6caefce3'
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
		if (!mountingContainerInformationService.hasDynamic(_actReservationScope.uuid)) {
			actReservationContainerService.prepareGridConfig(_actReservationScope.uuid, _actReservationScope,
				mountingContainerInformationService, 'ProductionPlanning.Mounting', dynamicActivityDataService);
		}

		var _trsReservationScope = {
			id: 'cce4e1d048ca486da12d36d97ffedca7',
			uuid: 'cce4e1d048ca486da12d36d97ffedca7',
			layout: 'cce4e1d048ca486da12d36d97ffedca7'
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
		var trsRequisitionDataService = $injector.get('productionplanningMountingTrsRequisitionDataService');
		if (!mountingContainerInformationService.hasDynamic(_trsReservationScope.uuid)) {
			trsReservationContainerService.prepareGridConfig(_trsReservationScope.uuid, _trsReservationScope,
				mountingContainerInformationService, 'ProductionPlanning.Mounting', trsRequisitionDataService);
		}

		modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('ppsMountingModelFilterService');

		// un-register on destroy
		$scope.$on('$destroy', function () {
			ppsDocumentReportService.unregisterReportPrepare();
			wizardService.deactivate();
			cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
			platformMainControllerService.unregisterCompletely(requisitionDataService, sidebarReports,
				translationService, options);
		});
	}
})();