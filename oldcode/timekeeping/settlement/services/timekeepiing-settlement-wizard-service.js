/**
 * Created by Sudarshan on 12.09.2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.settlement';
	angular.module(moduleName).service('timekeepingSettlementSidebarWizardService', TimekeepingSettlementSidebarWizardService);

	TimekeepingSettlementSidebarWizardService.$inject = ['basicsCommonChangeStatusService','timekeepingSettlementDataService'];

	function TimekeepingSettlementSidebarWizardService(basicsCommonChangeStatusService,timekeepingSettlementDataService) {
		let setTimekeepingSettlementStatus = function setTimekeepingSettlementStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: timekeepingSettlementDataService,
					statusField: 'SettlementStatusFK',
					projectField: '',
					title: 'timekeeping.settlement.timekeepingSettlementStatusWizard',
					statusName: 'timekeepingsettlementstatus',
					id: 1
				}
			);
		};
		this.setTimekeepingSettlementStatus = setTimekeepingSettlementStatus().fn;
	}

})(angular);