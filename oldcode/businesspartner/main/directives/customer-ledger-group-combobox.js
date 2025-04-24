(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.customerLedgerGroup = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'CustomerLedgerGroup',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerMainCustomerLedgerGroupCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.customerLedgerGroup().lookupOptions);
		}
	]);

})(angular, globals);