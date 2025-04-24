( function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.companyDeferalType = function companyDeferalType() {
		return {
			lookupOptions: {
				version:1,
				lookupType: 'companydeferaltype',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Description',
				width: 80,
				height: 200
			}
		};
	};

	angular.module('procurement.invoice').directive('basicsCompanyDeferaltypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.companyDeferalType().lookupOptions);
		}
	]);

})(angular, globals);