(function (angular) {
	'use strict';

	/**
	 * @name transportplanningRequisitionController
	 * @function
	 *
	 * */
	var moduleName = 'transportplanning.requisition';
	var requisitionModul = angular.module(moduleName);

	requisitionModul.controller('transportplanningRequisitionController', RequisitionController);
	RequisitionController.$inject = [
		'$scope',
		'platformMainControllerService',
		'transportplanningRequisitionMainService',
		'transportplanningRequisitionTranslationService',
		'transportplanningRequisitionWizardService',
		'basicsWorkflowInstanceService', 'basicsCommonChangeStatusService',
		'ppsDocumentReportService'];

	function RequisitionController(
		$scope,
		platformMainControllerService,
		dataService,
		translationService,
		wizardService,
		basicsWorkflowInstanceService, basicsCommonChangeStatusService,
		ppsDocumentReportService) {

		var options = {search: true, reports: false, auditTrail: '8f46b7b357214c92957409539cb5098d'};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, dataService,
			{}, translationService, moduleName, options);

		wizardService.activate();

		if (_.isFunction(dataService.mergeWorkflowData)) {
			basicsCommonChangeStatusService.onStatusChangedDone.register(dataService.checkForWorkflow);
			basicsWorkflowInstanceService.registerWorkflowCallback(dataService.mergeWorkflowData);
		}

		$scope.$on('$destroy', function () {
			ppsDocumentReportService.unregisterReportPrepare();
			wizardService.deactivate();
			platformMainControllerService.unregisterCompletely(dataService,
				sidebarReports,
				translationService,
				options);

			basicsCommonChangeStatusService.onStatusChangedDone.unregister(dataService.checkForWorkflow);
			basicsWorkflowInstanceService.unregisterWorkflowCallback(dataService.mergeWorkflowData);
		});

	}

})(angular);
