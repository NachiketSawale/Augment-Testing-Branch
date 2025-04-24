( function (angular) {
	'use strict';
	/* global globals */

	globals.lookups.VatGroup = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'VatGroup',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				uuid: '9243604bc21c4d4da29209324752493a',
				columns: [
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 120, name$tr$: 'cloud.common.entityDescription' },
					{ id: 'refe', field: 'Reference', name: 'Reference', width: 100, name$tr$: 'cloud.common.entityReference' }
				],
				width: 500,
				height: 200
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerVatGroupLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.VatGroup().lookupOptions);
		}
	]);
})(angular);