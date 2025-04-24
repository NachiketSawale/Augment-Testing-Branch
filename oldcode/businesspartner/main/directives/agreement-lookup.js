/**
 * Created by chi on 4/21/2016.
 */
// eslint-disable-next-line func-names
(function (angular, globals) {
	'use strict';

	globals.lookups.agreement = function quoteStatus() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'Agreement',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid: '2602e4a91e7f4ab79743db6f0dbfcee4',
				columns: [
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 120
					},
					{
						id: 'businessPartnerName1',
						field: 'BusinessPartnerName1',
						name: 'Business Partner Name 1',
						name$tr$: 'businesspartner.main.name1',
						width: 120
					},
					{id: 'validFrom', field: 'ValidFrom', name: 'Valid From', name$tr$: 'cloud.common.entityValidFrom', formatter: 'dateutc'},
					{id: 'validTo', field: 'ValidTo', name: 'Valid To', name$tr$: 'cloud.common.entityValidTo', formatter: 'dateutc'}
				],
				width: 500,
				height: 200
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerMainAgreementLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		// eslint-disable-next-line func-names
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.agreement().lookupOptions);
		}
	]);
// eslint-disable-next-line no-undef
})(angular, globals);