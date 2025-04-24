( function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.accrualModeLookup = function companyDeferalType() {
		return {
			lookupOptions: {
				version:1,
				lookupType: 'InvoiceAccrualMode',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Description',
				width: 80,
				height: 200
			}
		};
	};

	angular.module('procurement.invoice').directive('procurementInvoiceAccrualModeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.accrualModeLookup().lookupOptions);
		}
	]);

})(angular, globals);