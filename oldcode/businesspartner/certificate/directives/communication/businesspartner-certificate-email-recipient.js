/**
 * Created by chi on 1/12/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module('businesspartner.certificate').directive('businessPartnerCertificateEmailRecipient', businessPartnerCertificateEmailRecipient);

	function businessPartnerCertificateEmailRecipient() {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'businesspartner.certificate/partials/communication/businesspartner-certificate-email-recipient.html',
			controller: 'businessPartnerCertificateEmailRecipientController'
		};
	}
})(angular);