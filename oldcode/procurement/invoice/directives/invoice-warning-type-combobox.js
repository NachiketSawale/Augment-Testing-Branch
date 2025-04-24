/**
 * Created by wuj on 6/2/2015.
 */
( function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.invWarningType = function invWarningType() {
		return {
			lookupOptions: {
				lookupType: 'InvWarningType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				width: 80,
				height: 200
			}
		};
	};

	angular.module('procurement.invoice').directive('procurementInvoiceWarningTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.invWarningType().lookupOptions);
		}
	]);

})(angular, globals);