(function (angular) {
	'use strict';

	var moduleName = 'resource.enterprise';
	angular.module(moduleName).service('resourceEnterpriseWizardService', ResourceEnterpriseWizardService);

	ResourceEnterpriseWizardService.$inject = ['_', 'moment', '$http', 'platformSidebarWizardCommonTasksService', 'basicsCommonChangeStatusService',
		'basicsLookupdataSimpleLookupService', 'resourceEnterpriseDispatcherDataService', 'resourceEnterprisePlanningBoardReservationService','resourceEnterprisePlanningBoardRequisitionService'];

	function ResourceEnterpriseWizardService(_, moment, $http, platformSidebarWizardCommonTasksService, basicsCommonChangeStatusService,
		basicsLookupdataSimpleLookupService, resourceEnterpriseDispatcherDataService, resourceEnterprisePlanningBoardReservationService, resourceEnterprisePlanningBoardRequisitionService) {
		var changeReservationStatus = function changeReservationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: resourceEnterpriseDispatcherDataService,
					dataService: resourceEnterprisePlanningBoardReservationService,
					statusField: 'ReservationStatusFk',
					descField: 'Description',
					projectField: '',
					title: 'basics.customize.reservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					id: 1,
					supportMultiChange: true
				}
			);
		};
		this.changeReservationStatus = changeReservationStatus().fn;


		let changeRequisitionStatus = function changeRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: resourceEnterpriseDispatcherDataService,
					dataService: resourceEnterprisePlanningBoardRequisitionService,
					statusField: 'RequisitionStatusFk',
					descField: 'Description',
					projectField: '',
					title: 'resource.requisition.changeRequisitionStatusWizard.title',
					statusName: 'resrequisitionstatus',
					updateUrl: 'resource/requisition/changestatus',
					id: 1,
					supportMultiChange: true
				}
			);
		};
		this.changeRequisitionStatus = changeRequisitionStatus().fn;

	}
})(angular);
