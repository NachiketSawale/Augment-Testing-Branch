/**
 * Created by Sudarshan on 17.03.2023.
 */
(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.certificate';
	angular.module(moduleName).service('timekeepingCertificateSidebarWizardService', TimekeepingCertificateSidebarWizardService);

	TimekeepingCertificateSidebarWizardService.$inject = ['basicsCommonChangeStatusService','timekeepingCertificateDataService'];

	function TimekeepingCertificateSidebarWizardService(basicsCommonChangeStatusService,timekeepingCertificateDataService) {
		let changeCertificateStatus = function changeCertificateStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: true,
					mainService: timekeepingCertificateDataService,
					statusField: 'EmpCertficateStatusFk',
					projectField: '',
					title: 'timekeeping.certificate.changeStatus',
					statusName: 'timekeepingemployeecertificatestatus',
					id: 1
				}
			);
		};
		this.changeCertificateStatus = changeCertificateStatus().fn;
	}

})(angular);