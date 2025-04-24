(function () {
	'use strict';
	/* globals angular */
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportController', transportplanningTransportController);

	transportplanningTransportController.$inject = ['$scope', 'platformMainControllerService',
		'transportplanningTransportMainService',
		'transportplanningTransportTranslationService',
		'transportplanningTransportRouteWizardService',
		'basicsWorkflowInstanceService',
		'basicsCommonChangeStatusService',
		'cloudDesktopSidebarService',
		'ppsDocumentReportService'];

	function transportplanningTransportController($scope, platformMainControllerService,
												  transportplanningTransportMainService,
												  transportplanningTransportTranslationService,
												  wizardService,
												  basicsWorkflowInstanceService,
												  basicsCommonChangeStatusService,
												  cloudDesktopSidebarService,
												  ppsDocumentReportService) {
		var options = {search: true, reports: false, auditTrail: '4f279930137d4789978d4eb3309153a5'};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, transportplanningTransportMainService,
			{}, transportplanningTransportTranslationService, moduleName, options);
		wizardService.activate();
		if (_.isFunction(transportplanningTransportMainService.mergeWorkflowData)) {
			basicsCommonChangeStatusService.onStatusChangedDone.register(transportplanningTransportMainService.checkForWorkflow);
			basicsWorkflowInstanceService.registerWorkflowCallback(transportplanningTransportMainService.mergeWorkflowData);
		}

		// sidebar | information
		var info = {
			name: cloudDesktopSidebarService.getSidebarIds().info,
			title: 'info',
			type: 'template',
			templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/sidebar-info.html'
		};
		cloudDesktopSidebarService.registerSidebarContainer(info, true);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			ppsDocumentReportService.unregisterReportPrepare();
			wizardService.deactivate();
			platformMainControllerService.unregisterCompletely(transportplanningTransportMainService, sidebarReports,
				transportplanningTransportTranslationService, options);
			cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
			basicsCommonChangeStatusService.onStatusChangedDone.unregister(transportplanningTransportMainService.checkForWorkflow);
			basicsWorkflowInstanceService.unregisterWorkflowCallback(transportplanningTransportMainService.mergeWorkflowData);
		});
	}
})(angular);
