/**
 * Created by wui on 5/8/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	/* jshint -W072 */// has too many parameters
	angular.module(moduleName).factory('businesspartnerCertificateCertificateDataService', ['businesspartnerCertificateCertificateDataServiceFactory',
		function (certificateDataServiceFactory) {
			return certificateDataServiceFactory.create(moduleName);
		}
	]);

})(angular);