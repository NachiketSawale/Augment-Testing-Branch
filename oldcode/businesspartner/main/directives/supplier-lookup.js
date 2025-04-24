(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.Supplier = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'supplier',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '1633a99dcc624899959bb6e5df7456e3',
				columns: [
					{
						id: 'status', field: 'Id', name: 'Supplier Status', name$tr$: 'businesspartner.main.supplierStatus', width: 150,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Supplier',
							displayMember: 'SupplierStatusDescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService'
						}
					},
					{
						afterId: 'status',
						id: 'code',
						field: 'Code',
						name: 'Supplier Code',
						name$tr$: 'businesspartner.main.supplierCode',
						width: 100
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Supplier Description',
						name$tr$: 'businesspartner.main.entityDescription',
						width: 100
					},
					{
						id: 'bpName1',
						field: 'BusinessPartnerName1',
						name: 'Business Partner Name',
						name$tr$: 'businesspartner.main.name1',
						width: 150
					},
					{
						id: 'branchAddress',
						field: 'AddressLine',
						name: 'Branch Address',
						name$tr$: 'businesspartner.main.bpBranchAddress',
						width: 150
					}
				],
				width: 500,
				height: 200,
				title: {name: 'Supplier Search Dialog', name$tr$: 'businesspartner.main.supplierTitle'},
				pageOptions: {
					enabled: true
				}
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerMainSupplierLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let providerInfo = globals.lookups.Supplier();
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions);
		}
	]);

	angular.module('businesspartner.main').directive('businessPartnerMainSupplierDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let providerInfo = globals.lookups.Supplier();
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions);
		}
	]);
})(angular, globals);