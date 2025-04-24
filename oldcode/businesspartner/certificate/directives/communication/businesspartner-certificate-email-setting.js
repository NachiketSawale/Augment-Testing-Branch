/**
 * Created by chi on 1/12/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module('businesspartner.certificate').directive('businessPartnerCertificateEmailSetting', businessPartnerCertificateEmailSetting);

	function businessPartnerCertificateEmailSetting() {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'businesspartner.certificate/partials/communication/businesspartner-certificate-email-setting.html',
			controller: 'businessPartnerCertificateEmailSettingController'
		};
	}
})(angular);