(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.customer = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'customer',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'acdb63f1556c493481a7c302161e4d38',
				dialogUuid: '01b58cd4bbfb4df6a7ab38dc5781850e',
				columns: [
					{
						id: 'status', field: 'Id', name: 'Customer Status', name$tr$: 'businesspartner.main.customerStatus', width: 150, formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Customer',
							displayMember: 'CustomerStatusDescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService'
						}
					},
					{id: 'code', field: 'Code', name: 'Code', name$tr$: 'businesspartner.main.customerCode', width: 100},
					{id: 'description', field: 'Description', name: 'Description', name$tr$: 'businesspartner.main.description', width: 100},
					{id: 'description2', field: 'Description2', name: 'Description2', name$tr$: 'cloud.common.entityDescription2', width: 100},
					{id: 'supplier', field: 'SupplierNo', name: 'Supplier No', name$tr$: 'businesspartner.main.supplierCode', width: 100},
					{id: 'bpName1', field: 'BusinessPartnerName1', name: 'Business Partner Name', name$tr$: 'businesspartner.main.name1', width: 150},
					{id: 'addressLine', field: 'AddressLine', name: 'Branch Address', name$tr$: 'businesspartner.main.bpBranchAddress', width: 150},
				],
				width: 500,
				height: 200,
				title: {name: 'Customer Search Dialog', name$tr$: 'businesspartner.main.customerTitle'}
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerMainCustomerLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.customer().lookupOptions);
		}
	]);
})(angular);