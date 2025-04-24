( function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.invStatus = function invStatus() {
		return {
			lookupOptions: {
				lookupType: 'InvStatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				imageSelector: 'platformStatusIconService',
				width: 80,
				height: 200
			}
		};
	};

	angular.module('procurement.invoice').directive('procurementInvoiceStatusLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.invStatus().lookupOptions);
		}
	]);

})(angular, globals);