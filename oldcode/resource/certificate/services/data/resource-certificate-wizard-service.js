(function (angular) {
	'use strict';

	angular.module('resource.certificate').factory('resourceCertificateWizardService', ['_', 'basicsCommonChangeStatusService', 'resourceCertificateDataService',

		function (_, basicsCommonChangeStatusService, resourceCertificateDataService) {

			var service = {};

			function changeCertificateStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						mainService: resourceCertificateDataService,
						statusField: 'CertificateStatusFk',
						descField: 'Description',
						projectField: '',
						title: 'change.main.changeStatus',
						statusName: 'resourcecertificatestatus',
						updateUrl: 'resource/certificate/changestatus',
						id: 1
					}
				);
			}

			service.changeCertificateStatus = changeCertificateStatus().fn;
			return service;
		}

	]);
})(angular);
