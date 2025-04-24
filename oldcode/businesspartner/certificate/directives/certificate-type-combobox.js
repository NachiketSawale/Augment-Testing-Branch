/**
 * Created by wui on 5/13/2015.
 */

// eslint-disable-next-line func-names
(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.certificateType = function () {
		return {
			lookupOptions: {
				lookupType: 'CertificateType',
				valueMember: 'Id',
				displayMember: 'Description',
				version:3
			}
		};
	};

	angular.module('businesspartner.certificate').directive('businesspartnerCertificateCertificateTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.certificateType().lookupOptions);
		}]);

})(angular, globals);