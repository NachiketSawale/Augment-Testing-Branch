/**
 * Created by wui on 5/12/2015.
 */

(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.certificateStatus = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'CertificateStatus',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'platformStatusIconService'
			}
		};
	};

	angular.module('businesspartner.certificate').directive('businesspartnerCertificateStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.certificateStatus().lookupOptions);
		}
	]);

})(angular, globals);