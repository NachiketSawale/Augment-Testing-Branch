(function (angular) {
	'use strict';

	angular.module('resource.certificate').factory('resourceCertificateSidebarWizardService', ['_', 'basicsCommonChangeStatusService', 'basicsLookupdataSimpleLookupService', 'resourceCertificateDataService',

		function (_, basicsCommonChangeStatusService, basicsLookupdataSimpleLookupService, resourceCertificateDataService) {

			var service = {};

			function changeCertificateStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						mainService: resourceCertificateDataService,
						statusField: 'CertificateStatusFk',
						descField: 'Description',
						projectField: '',
						title: 'resource.certificate.changeStatus',
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
