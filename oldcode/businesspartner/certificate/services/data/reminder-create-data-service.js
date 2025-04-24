/**
 * Created by zos on 5/21/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.certificate';
	angular.module(moduleName).factory('businesspartnerCertificateReminderCreateDataService',
		['$http', 'businesspartnerCertificateCertificateDataService',
			function ($http, businesspartnerCertificateCertificateDataService) {
				return {
					updateCertificatesByReminder: function (batchId, batchDate, email, telefax) {
						var url = globals.webApiBaseUrl + 'businesspartner/certificate/certificatereminder/wizardcreate';
						// businesspartnerCertificateCertificateDataService.update();
						return $http.post(url, {
							BatchId: batchId,
							BatchDate: batchDate,
							Email: email,
							Telefax: telefax
						}).then(function success() {
							businesspartnerCertificateCertificateDataService.load();
						});
					}
				};
			}]);
})(angular);