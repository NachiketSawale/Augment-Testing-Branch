(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	let module = 'businesspartner.main';

	globals.lookups.creditStanding = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'creditstanding',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Description',
				uuid: 'acdb63f1556c493481a7c302161e4d38',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', name$tr$: 'businesspartner.main.creditstanding.Code', width: 100},
					{id: 'Description', field: 'DescriptionInfo.Description', name: 'Description', name$tr$: 'businesspartner.main.creditstanding.Description', width: 100}
				],
				width: 500,
				height: 200
			}
		};
	};

	angular.module(module).directive('businessPartnerMainCreditstandingLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.creditStanding().lookupOptions);
		}
	]);
})(angular, globals);