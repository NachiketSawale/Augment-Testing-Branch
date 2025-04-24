// eslint-disable-next-line func-names
(function (angular, globals) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.BusinessPartner = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'BusinessPartner',
				valueMember: 'Id',
				displayMember: 'BusinessPartnerName1',
				uuid: 'a3cac64f52af43beb1b7a32d127531bd',
				columns: [
					{
						id: 'BusinessPartnerStatus',
						field: 'Id',
						name: 'BusinessPartnerStatus',
						name$tr$: 'procurement.rfq.businessPartnerStatus',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'StatusDescriptionTranslateInfo.Translated',
							imageSelector: 'platformStatusIconService'
						},
						width: 100
					},
					{
						id: 'BusinessPartnerStatus2',
						field: 'Id',
						name: 'BusinessPartnerStatus2',
						name$tr$: 'businesspartner.main.businessPartnerStatus2',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'Status2DescriptionTranslateInfo.Translated',
							imageSelector: 'businesspartnerMainStatusSalesIconService'
						},
						width: 100
					},
					{
						id: 'bpName1',
						field: 'BusinessPartnerName1',
						name: 'Name 1',
						name$tr$: 'businesspartner.main.name1',
						width: 100
					},
					{
						id: 'bpName2',
						field: 'BusinessPartnerName2',
						name: 'Name 2',
						name$tr$: 'businesspartner.main.name2',
						width: 100
					},
					{
						id: 'bpName3',
						field: 'BusinessPartnerName3',
						name: 'Name 3',
						name$tr$: 'businesspartner.main.name3',
						width: 100
					},
					{
						id: 'bpName4',
						field: 'BusinessPartnerName4',
						name: 'Name 4',
						name$tr$: 'businesspartner.main.name4',
						width: 100
					},
					{
						id: 'tradeName',
						field: 'TradeName',
						name: 'Trade Name',
						name$tr$: 'businesspartner.main.tradeName',
						sortable: true,
						width: 100
					},
					{
						id: 'matchCode',
						field: 'MatchCode',
						name: 'Match Code',
						name$tr$: 'businesspartner.main.matchCode',
						width: 100
					},
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 150
					},
					{
						id: 'street',
						field: 'Street',
						name: 'Street',
						name$tr$: 'cloud.common.entityStreet',
						width: 150
					},
					{
						id: 'zipCode',
						field: 'ZipCode',
						name: 'ZipCode',
						name$tr$: 'cloud.common.entityZipCode',
						width: 100
					},
					{id: 'city', field: 'City', name: 'City', name$tr$: 'cloud.common.entityCity', width: 100},
					{id: 'iso2', field: 'Iso2', name: 'ISO2', name$tr$: 'cloud.common.entityISO2', width: 100},
					{id: 'vatNo', field: 'VatNo', name: 'VatNo', name$tr$: 'businesspartner.main.vatNo', width: 100},
					{id: 'taxNo', field: 'TaxNo', name: 'TaxNo', name$tr$: 'businesspartner.main.taxNo', width: 100}

				],
				title: {name: 'Assign Business Partner', name$tr$: 'cloud.common.dialogTitleBusinessPartner'},
				pageOptions: {
					enabled: true
				}
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerMainBusinessPartnerOldDialog', ['globals', 'BasicsLookupdataLookupDirectiveDefinition',
		function (globals, BasicsLookupdataLookupDirectiveDefinition) {

			let providerInfo = globals.lookups.BusinessPartner();

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions);

		}
	]);
	angular.module('businesspartner.main').directive('businessPartnerMainOptionalBusinessPartnerOldDialog', ['globals', 'BasicsLookupdataLookupDirectiveDefinition',
		function (globals, BasicsLookupdataLookupDirectiveDefinition) {

			let providerInfo = globals.lookups.BusinessPartner();
			providerInfo.lookupOptions.showClearButton = true;
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions);

		}
	]);

})(angular, globals);