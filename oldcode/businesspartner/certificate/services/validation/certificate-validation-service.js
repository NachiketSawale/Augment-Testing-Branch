/**
 * Created by wui on 5/12/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	angular.module(moduleName).factory('businesspartnerCertificateCertificateValidationService', ['businesspartnerCertificateCertificateValidationServiceFactory',
		'businesspartnerCertificateCertificateDataService',
		function (certificateValidationServiceFactory, certificateDataService) {
			return certificateValidationServiceFactory.create(certificateDataService);
		}
	]);

})(angular);