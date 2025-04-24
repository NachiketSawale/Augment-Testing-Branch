( function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.invType = function invType() {
		return {
			lookupOptions: {
				version:2,
				lookupType: 'InvType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				width: 80,
				height: 200
			}
		};
	};

	angular.module('procurement.invoice').directive('procurementInvoiceTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.invType().lookupOptions);
		}
	]);

})(angular, globals);